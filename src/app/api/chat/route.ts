// api/chat/route.ts
import { NextResponse } from "next/server"
import { OpenAI } from "openai"

import { prisma } from "@/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { conversationId, content } = await req.json()

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: "conversationId and content are required" },
        { status: 400 },
      )
    }

    // Récupérer l'historique
    const conversationHistory = await prisma.message.findMany({
      where: { gptConversationId: conversationId },
      orderBy: { createdAt: "asc" },
    })

    const messages = conversationHistory.map((msg) => ({
      role:
        msg.role === "user" ? "user" : ("assistant" as "user" | "assistant"),
      content: msg.content,
    }))

    // Stream OpenAI
    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are Pandorra, an AI assistant built by Pandorra.ai, help the user and answear all his question.",
        },
        ...messages,
        { role: "user", content },
      ],
      stream: true,
    })

    // Configuration spécifique pour la production
    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        let assistantMessageContent = ""

        try {
          for await (const chunk of stream) {
            const chunkContent = chunk.choices[0]?.delta?.content || ""
            assistantMessageContent += chunkContent

            // Encoder avec un délimiteur pour assurer la transmission
            controller.enqueue(encoder.encode(chunkContent))
          }

          // Sauvegarder les messages après le streaming
          await Promise.all([
            prisma.message.create({
              data: {
                content: content,
                role: "user",
                gptConversationId: conversationId,
              },
            }),
            prisma.message.create({
              data: {
                content: assistantMessageContent,
                role: "assistant",
                gptConversationId: conversationId,
              },
            }),
          ])
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    // Configuration des headers pour la production
    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Error in /api/chat:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
