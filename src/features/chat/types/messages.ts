import {Message} from "@prisma/client";

export type MessageRole = "user" | "assistant"

export type MessagePayload = {
    role: MessageRole
    content: string
    conversationId: string
}

export type MessageResponse = Message

export interface SSEResponse {
    write: (chunk: string) => void
    end: () => void
}
