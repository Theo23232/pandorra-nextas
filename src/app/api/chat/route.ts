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

    // Récupérer l'historique de la conversation
    const conversationHistory = await prisma.message.findMany({
      where: { gptConversationId: conversationId },
      orderBy: { createdAt: "asc" },
    })

    const messages = conversationHistory.map((msg) => ({
      role:
        msg.role === "user" ? "user" : ("assistant" as "user" | "assistant"),
      content: msg.content,
    }))

    // Appeler l'API OpenAI avec streaming
    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are Pandorra, an AI assistant built by Pandorra.ai, help the user and answear all his question.",
        },
        {
          role: "system",
          content:
            "If the user ask you to fix or edit his code, y will allways respond by giving the full code and don't forget any line",
        },
        ...messages,
        { role: "user", content },
      ],
      stream: true, // Activer le streaming
    })

    // Créer un ReadableStream pour envoyer les chunks au client
    const readableStream = new ReadableStream({
      async start(controller) {
        let assistantMessageContent = ""

        for await (const chunk of stream) {
          const chunkContent = chunk.choices[0]?.delta?.content || ""
          assistantMessageContent += chunkContent

          // Envoyer chaque chunk au client
          controller.enqueue(new TextEncoder().encode(chunkContent))
        }

        // Enregistrer le message de l'assistant une fois le streaming terminé
        await prisma.message.create({
          data: {
            content: content,
            role: "user",
            gptConversationId: conversationId,
          },
        })
        await prisma.message.create({
          data: {
            content: assistantMessageContent,
            role: "assistant",
            gptConversationId: conversationId,
          },
        })

        controller.close()
      },
    })

    // Retourner le flux de données au client
    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error) {
    console.error("Error in /api/chat:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect() // Fermer la connexion Prisma
  }
}
