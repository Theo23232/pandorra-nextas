'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import Bounce from '@/components/animated/uibeats/bounce'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {Conversation} from "@/features/chat/types/chat.types";
import Link from "next/link";
import {NewConversation} from "@/components/chat/NewConversation";


interface ConversationListProps {
    conversations: Conversation[]
    activeId?: string
    onSelect: (id: string) => void
    onNew: () => void
}

export function ConversationList({
                                     conversations,
                                     activeId,
                                     onSelect,
                                     onNew,
                                 }: ConversationListProps) {
    const { t } = useTranslation()

    return (
        <div className="p-4 pb-0">
            <NewConversation mutateConversation={onNew} />
            <ScrollArea className="h-[calc(100vh-168px)]">
                {conversations.length > 0 && (
                        <Bounce once className="mt-4 pr-4">
                            {conversations.map((conv: any) => (
                                <Link key={conv.id} href={`/chat/${conv.id}`}>
                                    <Button
                                        variant={activeId === conv.id ? "outline" : "ghost"}
                                        className={cn(
                                            "relative w-full max-w-[350px] justify-start truncate",
                                            activeId=== conv.id
                                                ? "bg-gray-100 text-primary dark:bg-gray-900"
                                                : ""
                                        )}
                                    >
                                        {conv.title}
                                    </Button>
                                </Link>
                            ))}
                        </Bounce>
                )}
            </ScrollArea>
        </div>
    )
}
