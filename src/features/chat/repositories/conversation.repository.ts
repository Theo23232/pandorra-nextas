import {Conversation , ConversationWithMessages} from "@/features/chat/types/conversation";


export interface IConversationRepository {
    getAllByUserId(userId: string): Promise<Conversation[]>
    create(data: { title: string; userId: string }): Promise<Conversation>
    findById(conversationId: string): Promise<ConversationWithMessages | null>
}
