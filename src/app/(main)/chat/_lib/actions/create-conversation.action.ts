"use server"
import {conversationService} from "@/injection";
import {revalidatePath} from "next/cache";
import {currentUser} from "@/lib/current-user";
import {redirect} from "next/navigation";

export async function createConversationAction() {
    const user = await currentUser()
    if (!user) {
        throw new Error("Unauthorized")
    }
    const conversation = await conversationService.createConversation(
        user.id,
        "New conversation"
    )
    revalidatePath("/chat")
    redirect(`/chat/${conversation.id}`)
}
