import {Conversation} from "@/features/chat/types/chat.types";

export interface IConversationRepository {
    getAllByUserId(userId: string): Promise<Conversation[]>
    create(data: { title: string; userId: string }): Promise<Conversation>
    update(data: {title}): Promise<Conversation>
}
