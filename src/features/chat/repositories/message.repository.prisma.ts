import { PrismaClient } from '@prisma/client'
import {IMessageRepository} from "@/features/chat/repositories/message.repository";

export class MessageRepositoryPrisma implements IMessageRepository{
    constructor(private prisma: PrismaClient) {}

    async getRecentMessages(conversationId: string, limit: number) {
        const messages = await this.prisma.message.findMany({
            where: { gptConversationId: conversationId },
            orderBy: { createdAt: 'desc' },
            take: limit * 3,
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

        const userMessage = await this.createMessage(conversationId, userContent, 'user');
        const assistantMessage = await this.createMessage(conversationId, assistantContent, 'assistant');

        return [userMessage, assistantMessage];
    }
}
