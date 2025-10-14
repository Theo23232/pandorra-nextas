import {GptConversation , Message} from "@prisma/client";

export type ConversationWithMessages = GptConversation & {
    messages: Message[]
}
export  type Conversation = GptConversation;


