import {NextRequest , NextResponse} from "next/server";
import {conversationService , messageService} from "@/injection";
import {SSEResponse} from "@/features/chat/types/messages";
import {currentUser} from "@/lib/current-user";


export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        const user = await currentUser()

        if (!user) {
            return NextResponse.json({ error: "Not authenticated", status: 403} )
        }

        let conversationId = data.conversationId
        if (!conversationId) {
            const newConversation = await conversationService.createConversationWithGeneratedTitle(
                user.id,
                data.content
            )
            conversationId = newConversation.id
            data.conversationId = conversationId
        }

        const stream = new ReadableStream({
            async start(controller) {
                const res= {
                    write: (chunk: string) => controller.enqueue(new TextEncoder().encode(chunk)),
                    end: () => controller.close(),
                } as SSEResponse;

                try {
                    await messageService.streamMessageToSSE(data, res)
                } catch (err) {
                    console.error("Streaming error:", err)
                    res.write("event: error\ndata: Streaming failed\n\n")
                    res.end();
                }
            },
        })

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                Connection: "keep-alive",
            },
        })
    } catch (err) {
        console.error("Request error:", err)
        return NextResponse.json(
            { error: "Invalid request or server error", status: 500 },
        )
    }
}
