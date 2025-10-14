import {NextRequest , NextResponse} from "next/server";
import {messageService} from "@/injection";
import {currentUser} from "@/lib/current-user";


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
        const messages = await messageService.getConversationMessages(id);
        return NextResponse.json({ success: true, data: messages })
    } catch (error) {
        console.error("Error fetching conversation messages:", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch messages", status: 500 },

        )
    }
}
