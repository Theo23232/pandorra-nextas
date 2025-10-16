"use client"

import { Button } from "@/components/ui/button"
import { Copy, Edit, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react"
import type { ChatRole } from "@/features/chat/types/chat.types"
import React from "react";

interface MessageActionsProps {
    role: ChatRole
    reaction: "like" | "dislike" | null
    onCopy: () => void
    onEdit?: () => void
    onRegenerate?: () => void
    onLike?: () => void
    onDislike?: () => void
}

export function MessageActions({
                                   role,
                                   reaction,
                                   onCopy,
                                   onEdit,
                                   onRegenerate,
                                   onLike,
                                   onDislike,
                               }: MessageActionsProps) {
    const isUser = role === "user"
    const isAssistant = role === "assistant"

    return (
        <div className="mt-2 flex items-center gap-1">
            <ActionButton icon={<Copy />} onClick={onCopy} />

            {isUser && onEdit && <ActionButton icon={<Edit />} onClick={onEdit} />}
            {isAssistant && onRegenerate && (
                <ActionButton icon={<RefreshCw />} onClick={onRegenerate} />
            )}

            {isAssistant && onLike && (
                <ActionButton
                    icon={<ThumbsUp />}
                    active={reaction === "like"}
                    activeColor="text-blue-500"
                    onClick={onLike}
                />
            )}

            {isAssistant && onDislike && (
                <ActionButton
                    icon={<ThumbsDown />}
                    active={reaction === "dislike"}
                    activeColor="text-red-500"
                    onClick={onDislike}
                />
            )}
        </div>
    )
}


function ActionButton({
                          icon,
                          onClick,
                          active = false,
                          activeColor = "",
                      }: {
    icon: React.ReactNode
    onClick: () => void
    active?: boolean
    activeColor?: string
}) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${active ? activeColor : ""}`}
            onClick={onClick}
        >
            {icon}
        </Button>
    )
}
