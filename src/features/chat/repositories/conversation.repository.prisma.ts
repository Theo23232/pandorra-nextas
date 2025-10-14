import {IConversationRepository} from "@/features/chat/repositories/conversation.repository";
import {Conversation , ConversationWithMessages} from "@/features/chat/types/conversation";
import {prisma} from "@/prisma";




export class  PrismaConversationRepository implements IConversationRepository {
    async create(data: { title: string; userId: string }): Promise<Conversation> {
        return  await prisma.gptConversation.create({ data })
    }

    async getAllByUserId(userId: string): Promise<Conversation[]> {
       return  await prisma.gptConversation.findMany({
           where: {userId},
           orderBy: { createdAt: "desc"}
       })
    }

    async findById(conversationId: string): Promise<ConversationWithMessages | null> {
        return await prisma.gptConversation.findUnique({
            where: { id: conversationId },
            include: { messages: true },
        })
    }

}
