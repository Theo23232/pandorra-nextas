"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import { useMessages } from "@/app/(main)/chat/_lib/hooks/useMessages"
import { useChat } from "@/app/(main)/chat/_lib/hooks/useChat"
import { MessageList } from "@/app/(main)/chat/_components/MessageList"
import { MessageInput } from "@/app/(main)/chat/_components/MessageInput"

export default function ConversationPage() {
    const params = useParams();
    const [conversationId, setConversationId] = useState<string>(params?.id as string)
    const [useWebSearch, setUseWebSearch] = useState(false)

    useEffect(() => {
        setConversationId(params?.id as string)
    }, [params?.id])

    const { messages } = useMessages(conversationId)
    const {
        newMessage,
        setNewMessage,
        sendMessage,
        stopGeneration,
        isStreaming,
        editingContent,
        editingMessageId,
        setEditingContent,
        setEditingMessageId,
        saveEdit
    } = useChat(conversationId)

    return (
        <>
            <div className="flex-1">
                <MessageList
                    messages={messages?.data}
                    isStreaming={isStreaming}
                    editingMessageId={editingMessageId}
                    setEditingMessageId={setEditingMessageId}
                    setEditingContent={setEditingContent}
                    saveEdit={saveEdit}
                    editingContent={editingContent}
                />
            </div>
            <div className="border-t p-2">
                <MessageInput
                    value={newMessage}
                    onChange={setNewMessage}
                    onSend={() => sendMessage(newMessage)}
                    onStop={stopGeneration}
                    isStreaming={isStreaming}
                    useWebSearch={useWebSearch}
                    setUseWebSearch={setUseWebSearch}
                />
            </div>
        </>
    )
}
