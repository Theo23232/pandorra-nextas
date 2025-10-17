
import {NextRequest , NextResponse} from "next/server";
import {ChatRequest} from "@/features/chat/types/chat.types";
import {chatService} from "@/features/injection";
import {currentUser} from "@/lib/current-user";




export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const {useWebSearch, content} = body as ChatRequest

    if (!user) {
      return NextResponse.json({ error: "Not authenticated", status: 403} )
    }

    let conversationId = body.conversationId
    if (!conversationId) {
      const newConversation = await chatService.createConversationWithGeneratedTitle(
          user.id,
          content
      )
      conversationId = newConversation.id
      body.conversationId = conversationId
    }

    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        let assistantMessageContent = ''

        try {
          const messages = await chatService.getConversationContext(conversationId)

          if (useWebSearch) {
            assistantMessageContent = await chatService.processWithWebSearch(
                conversationId,
                body.content,
                messages,
                controller,
                encoder
            )
          } else {
            assistantMessageContent = await chatService.processRegularChat(
                content,
                messages,
                controller,
                encoder
            )
          }

          await chatService.saveConversation(
              conversationId,
              content,
              assistantMessageContent
          )

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
