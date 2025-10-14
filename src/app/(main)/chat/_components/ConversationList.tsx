"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import React from "react";
import {useConversations} from "@/app/(main)/chat/_lib/hooks/useConversation";
import Bounce from "@/components/animated/uibeats/bounce";
import {NewConversation} from "@/app/(main)/chat/_components/NewConversation";


export const ConversationList: React.FC = () => {
    const { conversations } = useConversations()
    const params = useParams()
    const currentId = params?.id || "";

    return (
        <div className="sticky top-4 hidden h-fit max-h-[calc(100vh-28px)] w-96 flex-col md:flex p-4">
            <div className="overflow-hidden p-4 pb-0">
                <NewConversation />
                <ScrollArea className="h-[calc(100vh-168px)]">
                    {conversations?.data && conversations.data.length > 0 && (
                        <Bounce once className="mt-4 pr-4">
                            {conversations.data.map((conv: any) => (
                                <Link key={conv.id} href={`/chat/${conv.id}`}>
                                    <Button
                                        variant={currentId === conv.id ? "outline" : "ghost"}
                                        className={cn(
                                            "relative w-full max-w-[350px] justify-start truncate",
                                            currentId === conv.id
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
        </div>
    )
}

