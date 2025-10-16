'use client'

import { useState, useRef } from 'react'
import useSWR, { mutate } from 'swr'
import { fetcher } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useChatStream } from '@/hooks/chat/use-chat-stream'
import { updateMessageAction, setReactionAction } from '@/actions/chat/conversation.actions'
import { useUser } from '@/hooks/use-user'
import { useShowZeroPayement } from '@/hooks/use-show-zero-payement'
import { useMessageActions } from '@/hooks/chat/use-message-actions'
import { useMessages } from '@/hooks/chat/use-messages'
import { MessageType } from '@/features/chat/types/chat.types'

export function useChat(conversationId?: string) {
    const { toast } = useToast()
    const { user } = useUser()
    const { show } = useShowZeroPayement()
    const { copyMessage, showError, showSuccess } = useMessageActions()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { data, error } = useSWR<MessageType[]>(
        conversationId ? `/api/conversations/${conversationId}` : null,
        fetcher
    )
    const messages = data ?? []

    console.log(messages)

    const { removeMessage, updateAssistantMessage, addUserMessage, updateMessage } = useMessages()
    const { isStreaming, isLoading, streamMessage, stopStream } = useChatStream()

    const [newMessage, setNewMessage] = useState('')
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
    const [editingContent, setEditingContent] = useState('')
    const [useWebSearch, setUseWebSearch] = useState(false)

    const sendMessage = async (content: string) => {
        if (!content.trim() || !conversationId) return
        if (!user?.jeton) {
            show?.()
            return
        }

        const tempUserMessage: MessageType = {
            id: `user-${Date.now()}`,
            content,
            role: 'user',
            gptConversationId: conversationId,
            createdAt: new Date(),
            reaction: null,
        }

        const assistantMessage: MessageType = {
            id: `assistant-${Date.now()}`,
            content: '',
            role: 'assistant',
            gptConversationId: conversationId,
            createdAt: new Date(),
            reaction: null,
        }

        addUserMessage(content, conversationId)

        await mutate(
            `/api/conversations/${conversationId}`,
            (prev?: MessageType[]) => [...(prev ?? []), tempUserMessage, assistantMessage],
            false
        )

        try {
            await streamMessage(conversationId, content, useWebSearch, (streamContent) => {
                updateAssistantMessage(streamContent, conversationId)
                mutate(
                    `/api/conversations/${conversationId}`,
                    (prev?: MessageType[]) => {
                        if (!prev) return prev
                        return prev.map((m) =>
                            m.id === assistantMessage.id ? { ...m, content: streamContent } : m
                        )
                    },
                    false
                )
            })
        } catch (err: any) {
            console.error(err)
            toast({
                title: 'Erreur',
                description: err.message || 'Échec de l’envoi du message.',
                variant: 'error',
            })
        } finally {
            setNewMessage('')
        }
    }

    const saveEdit = async (messageId: string, newContent: string) => {
        try {
            updateMessage(messageId, newContent)
            await updateMessageAction(messageId, editingContent)
            await mutate(`/api/conversations/${conversationId}`)
            setEditingMessageId(null)
        } catch (err: any) {
            console.error(err)
            toast({ title: 'Erreur', description: 'Impossible de modifier le message.', variant: 'error' })
        }
    }

    const handleReaction = async (messageId: string, reaction: 'like' | 'dislike') => {
        try {
            await setReactionAction(messageId, reaction)
            showSuccess?.('Feedback envoyé !')
            await mutate(`/api/conversations/${conversationId}`)
        } catch (err: any) {
            console.error(err)
            showError?.('Impossible d’enregistrer la réaction')
        }
    }

    return {
        messages,
        newMessage,
        setNewMessage,
        editingMessageId,
        setEditingMessageId,
        editingContent,
        setEditingContent,
        useWebSearch,
        setUseWebSearch,
        messagesEndRef,
        isStreaming,
        isLoading,
        sendMessage,
        stopStream,
        saveEdit,
        handleReaction,
        copyMessage,
        removeMessage,
        updateAssistantMessage,
        error,
        addUserMessage,
        updateMessage,
    }
}
