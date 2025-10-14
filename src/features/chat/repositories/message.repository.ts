import {MessagePayload , MessageResponse} from "@/features/chat/types/messages";


export interface IMessageRepository {
    create(data: MessagePayload): Promise<MessageResponse>;
    updateContent(id: string, content: string): Promise<MessageResponse>;
    deleteByConversation(conversationId: string): Promise<void>;
    findByConversation(conversationId: string): Promise<MessageResponse[]>
}
