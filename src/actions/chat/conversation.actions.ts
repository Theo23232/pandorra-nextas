'use server'

import { revalidatePath } from 'next/cache'
import {prisma} from "@/prisma";
import {redirect} from "next/navigation";
import {chatService} from "@/features/injection";
import {User} from "@prisma/client";
import { SA } from "@/lib/safe-ation"



/**
 * Create a new conversation
 */
export const createConversationAction = SA(async (user: User) => {
    const conversation = await chatService.createConversation(user.id, 'New conversation')
    revalidatePath('/chat')
    redirect(`/chat/${conversation.id}`)
})

/**
 * Update a message
 */
export const updateMessageAction = SA(async (_user: User, messageId: string, content: string) => {
    await prisma.message.update({
        where: { id: messageId },
        data: { content },
    })
})

/**
 * Set reaction (like/dislike)
 */
export const setReactionAction = SA(
    async (_user: User, messageId: string, reaction: 'like' | 'dislike') => {
        await prisma.message.update({
            where: { id: messageId },
            data: { reaction },
        })
    },
)
