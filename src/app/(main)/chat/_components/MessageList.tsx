"use client"

import React, { useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Message } from "@/app/(main)/chat/_components/Message"
import type { MessageResponse } from "@/features/chat/types/messages"

export const MessageList: React.FC<{
    messages: MessageResponse[]
    isStreaming: boolean
    editingMessageId?: string | null
    editingContent?: string
    setEditingMessageId?: (id: string | null) => void
    setEditingContent?: (v: string) => void
    saveEdit?: (id: string) => void
}> = ({
          messages,
          isStreaming,
          editingMessageId,
          editingContent,
          setEditingMessageId,
          setEditingContent,
          saveEdit,
      }) => {
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div className="flex flex-col h-[calc(100vh-204px)] overflow-y-auto">
            <div className="flex flex-col mx-auto w-full max-w-3xl space-y-4 pt-12">
                {messages?.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex w-full ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        {editingMessageId === msg.id ? (
                            <div className="w-fit max-w-xl rounded-3xl bg-muted p-2">
                                <Textarea
                                    value={editingContent}
                                    onChange={(e) => setEditingContent?.(e.target.value)}
                                    className="min-h-[100px] resize-none border-0 bg-transparent p-2"
                                />
                                <div className="flex justify-end gap-2 p-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingMessageId?.(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={() => saveEdit?.(msg.id)}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Message
                                id={msg.id}
                                content={msg.content}
                                role={msg.role}
                                reaction={msg.reaction}
                                isStreaming={
                                    isStreaming &&
                                    msg.role === "assistant" &&
                                    msg === messages[messages.length - 1]
                                }
                                onEdit={
                                    msg.role === "user"
                                        ? () => {
                                            setEditingMessageId?.(msg.id)
                                            setEditingContent?.(msg.content)
                                        }
                                        : undefined
                                }
                            />
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}







