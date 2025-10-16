import {MessageType} from "@/features/chat/types/chat.types";

export interface IMessageRepository {
    getRecentMessages(conversationId: string, limit: number): Promise<MessageType[]>
    createMessage(
        conversationId: string,
        content: string,
        role: 'user' | 'assistant'
    ): Promise<MessageType>
}
