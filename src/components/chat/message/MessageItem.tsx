'use client'
import {ChatRole , MessageType} from "@/features/chat/types/chat.types";
import {MessageContent} from "@/components/chat/message/MessageContent";
import {MessageActions} from "@/components/chat/message/MessageActions";

interface MessageItemProps {
    message: MessageType
    isStreaming?: boolean
    isLoading?: boolean
    onCopy: () => void
    onEdit?: () => void
    onRegenerate?: () => void
    onLike?: () => void
    onDislike?: () => void
}

export function MessageItem({
                                message,
                                isStreaming = false,
                                isLoading = false,
                                onCopy,
                                onEdit,
                                onRegenerate,
                                onLike,
                                onDislike,
                            }: MessageItemProps) {
    const isUser = message.role === "user"
    const isAssistant = message.role === "assistant"

    return (
        <div
            className={`mb-4 ${
                isUser ? "ml-auto w-fit max-w-xl" : "max-w-3xl"
            }`}
        >
            <MessageContent
                content={message.content as string}
                role={message.role as ChatRole}
                isStreaming={isStreaming}
            />

            {!isStreaming && !isLoading && (
                <MessageActions
                    role={message.role as ChatRole}
                    reaction={message.reaction}
                    onCopy={onCopy}
                    onEdit={isUser ? onEdit : undefined}
                    onRegenerate={isAssistant ? onRegenerate : undefined}
                    onLike={isAssistant ? onLike : undefined}
                    onDislike={isAssistant ? onDislike : undefined}
                />
            )}
        </div>
    )
}
