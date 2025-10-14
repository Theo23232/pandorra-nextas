import React , {useState , useRef , useEffect} from "react"
import useSWR, { mutate } from "swr"
import axios from "axios"
import { fetcher } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { Message as MessageType, ReactionMessage } from "@prisma/client"
import {MessageResponse} from "@/features/chat/types/messages";
import {ApiResponse} from "@/types/api-response";




type UseChatReturn = {
    messages: MessageResponse[] | undefined
    newMessage: string
    setNewMessage: React.Dispatch<React.SetStateAction<string>>
    isStreaming: boolean
    isLoading: boolean
    editingMessageId: string | null
    editingContent: string
    setEditingContent: React.Dispatch<React.SetStateAction<string>>
    setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>
    sendMessage: (content: string) => Promise<void>
    stopGeneration: () => void
    saveEdit: (messageId: string) => Promise<void>
    handleReaction: (messageId: string, reaction: ReactionMessage) => Promise<void>
    error: any
}

export function useChat(conversationId?: string): UseChatReturn {
    const { toast } = useToast()

    const [newMessage, setNewMessage] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
    const [editingContent, setEditingContent] = useState("")
    const abortControllerRef = useRef<AbortController | null>(null)

    const { data, error } = useSWR<ApiResponse<MessageResponse[]>>(
        conversationId ? `/api/conversations/${conversationId}` : null,
        fetcher
    )

    const messages = data?.data ?? []

    useEffect(() => {
        return () => abortControllerRef.current?.abort()
    }, [])

    const sendMessage = async (content: string) => {
        if (!content.trim() || !conversationId) return

        setIsLoading(true)
        setIsStreaming(true)

        const controller = new AbortController()
        abortControllerRef.current = controller

        const tempUserMessage: MessageType = {
            id: `user-${Date.now()}`,
            content,
            role: "user",
            gptConversationId: conversationId,
            createdAt: new Date(),
            reaction: null,
        }

        const assistantMessage: MessageType = {
            id: `assistant-${Date.now()}`,
            content: "",
            role: "assistant",
            gptConversationId: conversationId,
            createdAt: new Date(),
            reaction: null,
        }

        await mutate(
            `/api/conversations/${conversationId}`,
            (prev?: ApiResponse<MessageResponse[]>) => {
                const prevMessages = prev?.data ?? []
                return { ...prev, success: true, data: [...prevMessages, tempUserMessage, assistantMessage] }
            },
            false
        )

        try {
            const response = await fetch(`/api/chat`, {
                method: "POST",
                body: JSON.stringify({ conversationId, content }),
                signal: controller.signal,
                headers: { "Accept": "text/event-stream", "Cache-Control": "no-cache" },
            })

            if (!response.body) throw new Error("No response body")

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ""

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split("\n")
                buffer = lines.pop() || ""

                for (const line of lines) {
                    if (!line.trim().startsWith("data:")) continue

                    let newText = line.replace(/^data:\s*/, "")

                    if (!newText.trim()) continue

                    newText = newText
                        .replace(/\\n/g, "\n")
                        .replace(/\\t/g, "\t")
                        .replace(/\\r/g, "")

                    await mutate(
                        `/api/conversations/${conversationId}`,
                        (prev?: ApiResponse<MessageResponse[]>) => {
                            if (!prev?.data) return prev

                            const updated = prev.data.map(m =>
                                m.id === assistantMessage.id
                                    ? { ...m, content: m.content + newText }
                                    : m
                            )

                            return { ...prev, data: updated , success: true}
                        },
                        false
                    )
                }
            }

            reader.releaseLock();
            await mutate(`/api/conversations/${conversationId}`);
        } catch (err: any) {
            if (err.name !== "AbortError") {
                console.error(err)
                toast({
                    title: "Erreur",
                    description: err.message || "Échec de l'envoi du message.",
                    variant: "error",
                })
            }
        } finally {
            setIsLoading(false)
            setIsStreaming(false)
            abortControllerRef.current = null
            setNewMessage("")
        }
    }

    const stopGeneration = () => {
        abortControllerRef.current?.abort()
        setIsStreaming(false)
        setIsLoading(false)
    }

    const saveEdit = async (messageId: string) => {
        try {
            await axios.patch(`/api/messages/${messageId}`, { content: editingContent })
            await mutate(`/api/conversations/${conversationId}`)
            setEditingMessageId(null)
            setEditingContent("")
        } catch (err: any) {
            console.error(err)
            toast({ title: "Erreur", description: "Impossible de modifier le message.", variant: "error" })
        }
    }

    const handleReaction = async (messageId: string, reaction: ReactionMessage) => {
        try {
            await axios.post(`/api/messages/${messageId}/reaction`, { reaction })
            await mutate(`/api/conversations/${conversationId}`)
            toast({ description: "Réaction envoyée !", variant: "success" })
        } catch (err: any) {
            console.error(err)
            toast({ title: "Erreur", description: "Impossible d'ajouter la réaction.", variant: "error" })
        }
    }

    return {
        messages,
        newMessage,
        setNewMessage,
        isStreaming,
        isLoading,
        editingMessageId,
        editingContent,
        setEditingContent,
        setEditingMessageId,
        sendMessage,
        stopGeneration,
        saveEdit,
        handleReaction,
        error,
    }
}


