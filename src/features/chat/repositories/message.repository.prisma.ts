import { PrismaClient } from '@prisma/client'
import {IMessageRepository} from "@/features/chat/repositories/message.repository";

export class MessageRepositoryPrisma implements IMessageRepository{
    constructor(private prisma: PrismaClient) {}

    async getRecentMessages(conversationId: string, limit: number) {
        const messages = await this.prisma.message.findMany({
            where: { gptConversationId: conversationId },
            orderBy: { createdAt: 'desc' },
            take: limit * 2,
        })
        return messages.reverse()
    }

    async createMessage(
        conversationId: string,
        content: string,
        role: 'user' | 'assistant'
    ) {
        return this.prisma.message.create({
            data: {
                content,
                role,
                gptConversationId: conversationId,
            },
        })
    }

    async saveMessagePair(
        conversationId: string,
        userContent: string,
        assistantContent: string
    ) {
        return Promise.all([
            this.createMessage(conversationId, userContent, 'user'),
            this.createMessage(conversationId, assistantContent, 'assistant'),
        ])
    }
}
