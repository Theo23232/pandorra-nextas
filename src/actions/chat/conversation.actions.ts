'use server'

import { revalidatePath } from 'next/cache'
import {prisma} from "@/prisma";
import {redirect} from "next/navigation";
import {currentUser} from "@/lib/current-user";
import {chatService} from "@/features/injection";


export async function createConversationAction() {
    const user = await currentUser()
    if (!user) {
        throw new Error("Unauthorized")
    }
    const conversation = await chatService.createConversation(
        user.id,
        "New conversation"
    )
    revalidatePath("/chat")
    redirect(`/chat/${conversation.id}`)
}

export async function updateMessageAction(messageId: string, content: string) {
    await prisma.message.update({
        where: { id: messageId },
        data: { content },
    })
}

export async function setReactionAction(
    messageId: string,
    reaction: 'like' | 'dislike'
) {
    await prisma.message.update({
        where: { id: messageId },
        data: { reaction },
    })
}
