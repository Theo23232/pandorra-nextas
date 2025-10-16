import {Conversation} from "@/features/chat/types/chat.types";
import {IConversationRepository} from "@/features/chat/repositories/conversation.repository";
import {PrismaClient} from "@prisma/client";

export class  PrismaConversationRepository implements IConversationRepository{
    constructor(private prisma: PrismaClient) {}
    async create(data: { title: string; userId: string }): Promise<Conversation> {
        return this.prisma.gptConversation.create({data});
    }

    async getAllByUserId(userId: string): Promise<Conversation[]> {
        return  this.prisma.gptConversation.findMany({
            where: {userId},
            orderBy: { createdAt: "desc"}
        })
    }

    update(data: { title: string , conversationId: string}): Promise<Conversation> {
        const { title, conversationId } = data
        return this.prisma.gptConversation.update({
            where: {id: conversationId}, data: {
                title
            }
        })
    }
}
