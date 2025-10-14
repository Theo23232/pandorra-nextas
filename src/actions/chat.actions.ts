"use server"

import { OpenAI } from 'openai';

import { trackUserActivity } from '@/actions/user.ations';
import { currentUser } from '@/lib/current-user';
import { SA } from '@/lib/safe-ation';
import { prisma } from '@/prisma';
import { Message, ReactionMessage } from '@prisma/client';

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY!,
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
      model: "deepseek-old_chat",
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


export const editMessage = SA(async (user, messageId: string, content: string): Promise<Message> => {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { GptConversation: true },
  })

  if (!message || message.GptConversation.userId !== user.id) {
    throw new Error("Message not found or not authorized")
  }

  if (message.role !== "user") {
    throw new Error("Only user messages can be edited")
  }

  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: { content },
  })
  return updatedMessage
})

export const reactMessage = SA(async (user, messageId: string, reaction: ReactionMessage) => {

  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { GptConversation: true },
  })

  // Check if message exists and belongs to the user
  if (!message || message.GptConversation.userId !== user.id) {
    throw new Error("Message not found or not authorized")
  }

  // Only allow reactions on assistant messages
  if (message.role !== "assistant") {
    throw new Error("Only assistant messages can receive reactions")
  }

  await prisma.message.update({
    where: { id: messageId },
    data: {
      reaction
    }
  })
})
