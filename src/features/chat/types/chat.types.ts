import {Message} from "@prisma/client";

export interface ChatRequest {
    conversationId: string
    content: string
    useWebSearch?: boolean
}

export interface ChatMessage {
    role: ChatRole,
    content: string
}

export type ChatRole = 'user' | 'assistant' | 'system'

export interface SearchResult {
    title: string
    snippet: string
    link: string
}

export interface StreamChunk {
    content: string
    done: boolean
}

export type MessageType  = Message

export interface Conversation {
    id: string
    title: string
    userId: string
    createdAt: Date
}
