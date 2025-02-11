"use server"

import { OpenAI } from 'openai';

import { currentUser } from '@/lib/current-user';
import { prisma } from '@/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function postMessage(gptConversationId: string, content: string) {
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
    // Appel à l'API OpenAI
    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-4",
    })

    const assistantMessageContent = response.choices[0]?.message?.content

    if (assistantMessageContent) {
      // Enregistrer le message de l'assistant
      const assistantMessage = await prisma.message.create({
        data: {
          content: assistantMessageContent,
          role: "assistant",
          gptConversationId,
        },
      })

      return { userMessage, assistantMessage }
    } else {
      throw new Error("OpenAI did not return a message")
    }
  } catch (error) {
    console.error("Error contacting OpenAI:", error)
    throw new Error("Error contacting OpenAI")
  }
}
