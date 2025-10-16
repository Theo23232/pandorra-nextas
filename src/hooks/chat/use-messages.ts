import { useState, useCallback } from 'react'
import {MessageType} from "@/features/chat/types/chat.types";


export function useMessages(initialMessages: MessageType[] = []) {
    const [messages, setMessages] = useState<MessageType[]>(initialMessages)

    const addUserMessage = useCallback((content: string, conversationId: string) => {
        const userMessage: MessageType = {
            id: Date.now().toString(),
            content,
            role: 'user',
            gptConversationId: conversationId,
            createdAt: new Date(),
            reaction: null,
        }
        setMessages((prev) => [...prev, userMessage])
        return userMessage
    }, [])

    const updateAssistantMessage = useCallback((content: string, conversationId: string) => {
        setMessages((prev) => {
            const lastMessage = prev[prev.length - 1]
            if (lastMessage?.role === 'assistant') {
                return [
                    ...prev.slice(0, -1),
                    { ...lastMessage, content },
                ]
            } else {
                return [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        content,
                        role: 'assistant',
                        gptConversationId: conversationId,
                        createdAt: new Date(),
                        reaction: null,
                    },
                ]
            }
        })
    }, [])

    const updateMessage = useCallback((id: string, content: string) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, content } : msg))
        )
    }, [])

    const removeMessage = useCallback((id: string) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id))
    }, [])

    const resetMessages = useCallback(() => {
        setMessages([])
    }, [])

    return {
        messages,
        setMessages,
        addUserMessage,
        updateAssistantMessage,
        updateMessage,
        removeMessage,
        resetMessages,
    }
}
