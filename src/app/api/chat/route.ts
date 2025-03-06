import { NextResponse } from "next/server"
import { OpenAI } from "openai"

import { searchWeb } from "@/lib/search"
import { prisma } from "@/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { conversationId, content, useWebSearch = false } = await req.json()

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

    // Configuration spécifique pour la production
    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        let assistantMessageContent = ""

        try {
          // If web search is enabled, first check if we need to search
          if (useWebSearch) {
            // Ask OpenAI if this query requires web search
            const needsSearchResponse = await openai.chat.completions.create({
              model: "gpt-4",
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
              // Signal to the user that we're searching
              controller.enqueue(
                encoder.encode(
                  "🔍 Searching the web for information... Please wait.\n\n",
                ),
              )

              // Perform the web search
              const searchResults = await searchWeb(content)

              if (typeof searchResults === "string") {
                // Error occurred
                controller.enqueue(encoder.encode(`${searchResults}\n\n`))
                assistantMessageContent += `${searchResults}\n\n`
              } else {
                // Format search results for display
                const formattedResults = searchResults
                  .map(
                    (result: any, index: number) =>
                      `${index + 1}. **${result.title}**\n   ${result.snippet}\n   [${result.link}](${result.link})\n`,
                  )
                  .join("\n")

                controller.enqueue(
                  encoder.encode(
                    `Found information:\n\n${formattedResults}\n\n`,
                  ),
                )
                assistantMessageContent += `🔍 Web search results:\n\n${formattedResults}\n\n`

                // Now use OpenAI to analyze the search results
                const stream = await openai.chat.completions.create({
                  model: "gpt-4",
                  messages: [
                    {
                      role: "system",
                      content: `You are Pandorra, an AI assistant built by Pandorra.ai. Help the user by analyzing web search results and providing a comprehensive answer. When citing sources, always use descriptive link text instead of URLs. For example, use [Article Title](URL) instead of [URL](URL). Always cite your sources.
                       Inseade of [//duckduckgo.com/l/?uddg=https%3A%2F%2Fplanetrulers.com%2Fmadagascar%2Dpresident%2F&rut=caac32c0d223000637fe1fc4b9564d84bbf32f35d8b632b7cdf62b6d67d7fed2](planetrulers.com) for example send [//duckduckgo.com/l/?uddg=https%3A%2F%2Fplanetrulers.com%2Fmadagascar%2Dpresident%2F&rut=caac32c0d223000637fe1fc4b9564d84bbf32f35d8b632b7cdf62b6d67d7fed2](//duckduckgo.com/l/?uddg=https%3A%2F%2Fplanetrulers.com%2Fmadagascar%2Dpresident%2F&rut=caac32c0d223000637fe1fc4b9564d84bbf32f35d8b632b7cdf62b6d67d7fed2)`,
                    },
                    ...messages,
                    {
                      role: "user",
                      content: `My question is: ${content}\n\nHere are web search results:\n${JSON.stringify(searchResults)}\n\nPlease analyze these results and answer my question.`,
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
              // No need for web search, proceed with regular response
              const stream = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                  {
                    role: "system",
                    content:
                      "You are Pandorra, an AI assistant built by Pandorra.ai, help the user and answear all his question. And for link Inseade of [//duckduckgo.com/l/?uddg=https%3A%2F%2Fplanetrulers.com%2Fmadagascar%2Dpresident%2F&rut=caac32c0d223000637fe1fc4b9564d84bbf32f35d8b632b7cdf62b6d67d7fed2](planetrulers.com) for example send [//duckduckgo.com/l/?uddg=https%3A%2F%2Fplanetrulers.com%2Fmadagascar%2Dpresident%2F&rut=caac32c0d223000637fe1fc4b9564d84bbf32f35d8b632b7cdf62b6d67d7fed2](//duckduckgo.com/l/?uddg=https%3A%2F%2Fplanetrulers.com%2Fmadagascar%2Dpresident%2F&rut=caac32c0d223000637fe1fc4b9564d84bbf32f35d8b632b7cdf62b6d67d7fed2)",
                  },
                  ...messages,
                  { role: "user", content },
                ],
                stream: true,
              })

              for await (const chunk of stream) {
                const chunkContent = chunk.choices[0]?.delta?.content || ""
                assistantMessageContent += chunkContent
                controller.enqueue(encoder.encode(chunkContent))
              }
            }
          } else {
            // Regular response without web search
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
