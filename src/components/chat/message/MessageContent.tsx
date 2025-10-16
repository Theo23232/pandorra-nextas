'use client'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import remarkGfm from "remark-gfm"
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {ChatRole} from "@/features/chat/types/chat.types";
import Image from "next/image";
import {useTranslation} from "react-i18next";
import Bounce from "@/components/animated/uibeats/bounce";

interface MessageContentProps {
    content: string
    role: ChatRole
    isStreaming?: boolean
}

export function MessageContent({
                                   content,
                                   role,
                                   isStreaming = false,
                               }: MessageContentProps) {

    const { t } = useTranslation();
    const isUser = role === "user"
    if (isUser) {
        return (
            <Bounce once className="group relative rounded-3xl bg-muted px-5 py-3">
                <p className="whitespace-pre-wrap">{content}</p>
            </Bounce>
        )
    }

    return (
        <Bounce once className="group relative rounded-lg bg-background p-4 text-foreground prose dark:prose-invert max-w-none">
            {isStreaming && (
                <div className="mb-2 animate-pulse text-sm text-muted-foreground">
                    {t("Pandorra is thinking...")}
                </div>
            )}
            <div className={isStreaming ? "animate-fade-in" : ""}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                    {content}
                </ReactMarkdown>
            </div>
        </Bounce>
    )
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
