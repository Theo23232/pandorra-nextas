import {NextRequest , NextResponse} from "next/server";
import {currentUser} from "@/lib/current-user";
import {conversationService} from "@/injection";




export async  function GET() {
    try{
       const user = await currentUser();
        if (!user)
            return NextResponse.json({ error: "Not authenticated", }, { status: 403 })
        const conversations = await conversationService.getUserConversations(user.id);

        return NextResponse.json({ success: true, data: conversations})
    }catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch conversations", status: 500 },
        )
    }
}
