import {IMessageRepository} from "@/features/chat/repositories/message.repository";
import {MessagePayload , MessageResponse} from "@/features/chat/types/messages";
import {prisma} from "@/prisma";


export class PrismaMessageRepository implements IMessageRepository {
    async create(data: MessagePayload): Promise<MessageResponse> {
        const { conversationId, content, role } = data

        return prisma.message.create({
            data: {
                content,
                role,
                GptConversation:
                     {
                        connect: { id: conversationId },
                    }
            },
            include: {
                GptConversation: true,
            },
        })

    }

    async updateContent(id: string, content: string): Promise<MessageResponse> {
        return prisma.message.update({
            where: { id },
            data: { content },
        })
    }

    async deleteByConversation(conversationId: string): Promise<void> {
        await prisma.message.deleteMany({ where: { gptConversationId: conversationId } })
    }

    async findByConversation(conversationId: string) {
        return prisma.message.findMany({
            where: { gptConversationId: conversationId },
            orderBy: { createdAt: "asc" },
        })
    }
}
