import { NextResponse } from "next/server"
import { OpenAI } from "openai"

import { searchWeb } from "@/lib/search"
import { prisma } from "@/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Nombre maximum de messages à conserver dans l'historique
const MAX_HISTORY_LENGTH = 10
// Modèle moins cher pour les vérifications préliminaires
const CHEAPER_MODEL = "gpt-3.5-turbo"
// Modèle principal pour les réponses
const MAIN_MODEL = "gpt-4"

export async function POST(req: Request) {
  try {
    const { conversationId, content, useWebSearch = false } = await req.json()

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: "conversationId and content are required" },
        { status: 400 },
      )
    }

    // Récupérer uniquement les messages récents (limite à MAX_HISTORY_LENGTH)
    const conversationHistory = await prisma.message.findMany({
      where: { gptConversationId: conversationId },
      orderBy: { createdAt: "desc" },
      take: MAX_HISTORY_LENGTH * 2, // Multiplie par 2 car chaque échange a un message utilisateur et un message assistant
    })

    // Inverser pour obtenir l'ordre chronologique
    conversationHistory.reverse()

    // Extraire les messages les plus importants
    const messages = conversationHistory.map((msg) => ({
      role:
        msg.role === "user" ? "user" : ("assistant" as "user" | "assistant"),
      content: msg.content,
    }))

    // Ajouter un message système de résumé pour le contexte
    const systemMessage = {
      role: "system" as "system",
      content:
        "You are Pandorra, an AI assistant built by Pandorra.ai. Previous conversation context has been summarized. Respond to the user's current query based on the recent conversation history provided.",
    }

    // Configuration pour le streaming
    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        let assistantMessageContent = ""

        try {
          if (useWebSearch) {
            // Utiliser un modèle moins cher pour déterminer si une recherche web est nécessaire
            const needsSearchResponse = await openai.chat.completions.create({
              model: CHEAPER_MODEL, // Modèle moins cher
              messages: [
                {
                  role: "system",
                  content:
                    "You are an AI assistant that determines if a user query requires current information from the web. Respond with only 'YES' if the query likely needs current information or 'NO' if it can be answered with general knowledge.",
                },
                { role: "user", content },
              ],
              temperature: 0.1,
              max_tokens: 5,
            })

            const needsSearch =
              needsSearchResponse.choices[0]?.message?.content
                ?.trim()
                .toUpperCase() === "YES"

            if (needsSearch) {
              controller.enqueue(
                encoder.encode(
                  "🔍 Searching the web for information... Please wait.\n\n",
                ),
              )

              const searchResults = await searchWeb(content)

              if (typeof searchResults === "string") {
                controller.enqueue(encoder.encode(`${searchResults}\n\n`))
                assistantMessageContent += `${searchResults}\n\n`
              } else {
                controller.enqueue(encoder.encode(`Found information:\n\n`))

                // Utiliser des résultats de recherche condensés
                const condensedSearchResults = searchResults
                  .slice(0, 3)
                  .map((result: any) => ({
                    title: result.title,
                    snippet:
                      result.snippet.substring(0, 150) +
                      (result.snippet.length > 150 ? "..." : ""),
                    link: result.link,
                  }))

                // Modèle pour analyse des résultats de recherche
                const stream = await openai.chat.completions.create({
                  model: MAIN_MODEL,
                  messages: [
                    {
                      role: "system",
                      content: `You are Pandorra, an AI assistant built by Pandorra.ai. Help the user by analyzing web search results and providing a comprehensive answer. When citing sources, always use descriptive link text instead of URLs. Always cite your sources. And add a list the top the 3 web research at the end of message using the user's language`,
                    },
                    ...messages.slice(-4), // Uniquement les 4 derniers messages pour le contexte immédiat
                    {
                      role: "user",
                      content: `My question is: ${content}\n\nHere are web search results:\n${JSON.stringify(condensedSearchResults)}\n\nPlease analyze these results and answer my question.`,
                    },
                  ],
                  stream: true,
                })

                controller.enqueue(
                  encoder.encode(
                    "Based on the search results, here's what I found:\n\n",
                  ),
                )
                assistantMessageContent +=
                  "Based on the search results, here's what I found:\n\n"

                for await (const chunk of stream) {
                  const chunkContent = chunk.choices[0]?.delta?.content || ""
                  assistantMessageContent += chunkContent
                  controller.enqueue(encoder.encode(chunkContent))
                }
              }
            } else {
              // Pas besoin de recherche web
              const reducedMessages = [
                systemMessage,
                ...messages.slice(-6), // Seulement les 3 derniers échanges (6 messages)
              ]

              // Ajouter le message utilisateur actuel
              reducedMessages.push({ role: "user", content })

              const stream = await openai.chat.completions.create({
                model: MAIN_MODEL,
                messages: reducedMessages,
                stream: true,
              })

              for await (const chunk of stream) {
                const chunkContent = chunk.choices[0]?.delta?.content || ""
                assistantMessageContent += chunkContent
                controller.enqueue(encoder.encode(chunkContent))
              }
            }
          } else {
            // Réponse régulière sans recherche web avec historique réduit
            const reducedMessages = [
              systemMessage,
              ...messages.slice(-6), // Seulement les 3 derniers échanges (6 messages)
            ]

            // Ajouter le message utilisateur actuel
            reducedMessages.push({ role: "user", content })

            const stream = await openai.chat.completions.create({
              model: MAIN_MODEL,
              messages: reducedMessages,
              stream: true,
            })

            for await (const chunk of stream) {
              const chunkContent = chunk.choices[0]?.delta?.content || ""
              assistantMessageContent += chunkContent
              controller.enqueue(encoder.encode(chunkContent))
            }
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

          // Si l'historique devient trop long, envisager de périodiquement générer un résumé
          // et de supprimer les anciens messages
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

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
