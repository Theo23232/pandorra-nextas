"use server"

import { OpenAI } from "openai"

import { trackUserActivity } from "@/actions/user.ations"
import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function postMessage(gptConversationId: string, content: string) {
  await trackUserActivity("postMessage")

  const user = await currentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Enregistrer le message utilisateur
  const userMessage = await prisma.message.create({
    data: {
      content,
      role: "user",
      gptConversationId,
    },
  })

  // Récupérer l'historique de la conversation
  const conversationHistory = await prisma.message.findMany({
    where: { gptConversationId },
    orderBy: { createdAt: "asc" },
  })

  const messages = conversationHistory.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }))

  try {
    // Appel à l'API OpenAI avec streaming
    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      stream: true, // Activer le streaming
    })

    // Retourner un ReadableStream pour le client
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
            content: assistantMessageContent,
            role: "assistant",
            gptConversationId,
          },
        })

        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error) {
    console.error("Error contacting OpenAI:", error)
    throw new Error("Error contacting OpenAI")
  }
}
