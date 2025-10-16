import {NextRequest , NextResponse} from "next/server";
import {currentUser} from "@/lib/current-user";
import {chatService} from "@/features/injection";

interface IGetConversationParams {
    id: string
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<IGetConversationParams> }
) {
    const { id } = await params
    try {
        const user = await currentUser();
        if (!user)
            return NextResponse.json({ error: "Not authenticated" }, { status: 403})
        const messages = await chatService.getConversationMessages(id);
        return NextResponse.json(messages)
    } catch (error) {
        console.error("Error fetching conversation messages:", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch messages", status: 500 },

        )
    }
}
