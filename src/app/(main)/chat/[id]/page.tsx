'use client'

import {useRef , use , useEffect} from 'react'
import { MagicCard } from '@/components/animated/magic-ui/magic-card'
import { MessageEditor } from '@/components/chat/message/MessageEditor'
import { MessageItem } from '@/components/chat/message/MessageItem'
import { ChatInput } from '@/components/chat/ChatInput'
import { useChat } from '@/hooks/chat/use-chat'

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: conversationId } = use(params)

    const {
        messages,
        newMessage,
        setNewMessage,
        useWebSearch,
        setUseWebSearch,
        editingMessageId,
        setEditingMessageId,
        messagesEndRef,
        isStreaming,
        isLoading,
        sendMessage,
        stopStream,
        saveEdit,
        handleReaction,
        copyMessage,
    } = useChat(conversationId)

    useEffect(() => {
        const pending = sessionStorage.getItem('pendingMessage')
        if (pending) {
            const { content, useWebSearch: shouldUseWebSearch } = JSON.parse(pending)
            sessionStorage.removeItem('pendingMessage')
            setUseWebSearch(shouldUseWebSearch)
            sendMessage(content).then(r => {} )
        }
    }, [])

    return (
        <div className="h-full max-h-[calc(100vh-80px)] w-full overflow-y-scroll py-[4px]">
            <div className="mx-auto flex h-fit w-full max-w-3xl flex-col p-2 pb-0">
                <div className="min-h-[calc(100vh-204px)] flex-1 p-4">
                    {messages.map((message, index) => (
                        <div key={message.id}>
                            {editingMessageId === message.id ? (
                                <MessageEditor
                                    initialContent={message.content as string}
                                    onSave={saveEdit}
                                    onCancel={() => setEditingMessageId(null)}
                                    messageId={message.id}
                                />
                            ) : (
                                <MessageItem
                                    message={message}
                                    isStreaming={isStreaming && message.role === 'assistant' && index === messages.length - 1}
                                    onCopy={() => copyMessage(message.content as string)}
                                    onEdit={message.role === 'user' ? () => setEditingMessageId(message.id) : undefined}
                                    onRegenerate={message.role === 'assistant' ? () => {} : undefined} // add if you implement regenerate
                                    onLike={message.role === 'assistant' ? () => handleReaction(message.id, 'like') : undefined}
                                    onDislike={message.role === 'assistant' ? () => handleReaction(message.id, 'dislike') : undefined}
                                />
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} className="pb-12" />
                </div>

                <MagicCard className="sticky bottom-4 z-50 p-4 shadow-none">
                    <ChatInput
                        value={newMessage}
                        onChange={setNewMessage}
                        onSubmit={() => sendMessage(newMessage)}
                        isLoading={isLoading}
                        isStreaming={isStreaming}
                        onStop={stopStream}
                        useWebSearch={useWebSearch}
                        onWebSearchToggle={setUseWebSearch}
                    />
                </MagicCard>
            </div>
        </div>
    )
}
