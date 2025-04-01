"use client"

import type React from "react"

import { Copy, Edit, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import Bounce from "@/components/animated/uibeats/bounce"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type MessageProps = {
  id: string
  content: string
  role: string
  reaction?: "like" | "dislike" | null
  isStreaming?: boolean
  isLoading?: boolean
  onCopy?: () => void
  onEdit?: () => void
  onRegenerate?: () => void
  onLike?: () => void
  onDislike?: () => void
}

const components = {
  img: (image: any) => {
    return (
      <Image
        src={image.src || "/placeholder.svg"}
        alt={image.alt}
        width={500}
        height={500}
        className="rounded-md"
      />
    )
  },
  a: ({ href, children }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline"
    >
      {children}
    </a>
  ),
}

export const Message: React.FC<MessageProps> = ({
  content,
  id,
  role,
  reaction,
  isStreaming,
  isLoading,
  onCopy,
  onEdit,
  onRegenerate,
  onLike,
  onDislike,
}) => {
  const { t } = useTranslation()

  if (role === "user") {
    return (
      <Bounce
        once={true}
        className={`group relative ml-auto w-fit max-w-xl rounded-3xl bg-muted px-5 py-2.5`}
      >
        <div className="whitespace-pre-wrap">{content}</div>
        <div
          className={`absolute -bottom-2 right-2 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100`}
        >
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onEdit}
              title={t("Edit message")}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          )}
          {onCopy && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onCopy}
              title={t("Copy message")}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </Bounce>
    )
  }

  return (
    <Bounce
      once={true}
      className={`group relative rounded-lg bg-background p-4 text-foreground`}
    >
      {isStreaming && (
        <div className="mb-2 animate-pulse text-sm text-muted-foreground">
          {t(`Pandorra is thinking...`)}
        </div>
      )}
      <div className={`${isStreaming ? "animate-fade-in" : ""}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
      {!isStreaming && (
        <div
          className={`absolute -bottom-2 left-2 flex justify-end gap-1 transition-opacity`}
        >
          {onRegenerate && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onRegenerate}
              title={t("Regenerate response")}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
          {onLike && (
            <Button
              variant={reaction === "like" ? "default" : "ghost"}
              size="icon"
              className={cn(
                "h-6 w-6",
                reaction === "like" &&
                  "bg-green-500 text-white hover:bg-green-600",
              )}
              onClick={onLike}
              title={t("Like")}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
          )}
          {onDislike && (
            <Button
              variant={reaction === "dislike" ? "default" : "ghost"}
              size="icon"
              className={cn(
                "h-6 w-6",
                reaction === "dislike" &&
                  "bg-red-500 text-white hover:bg-red-600",
              )}
              onClick={onDislike}
              title={t("Dislike")}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          )}
          {onCopy && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onCopy}
              title={t("Copy message")}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </Bounce>
  )
}
