"use client"
import {MagicCard} from "@/components/animated/magic-ui/magic-card";
import React from "react";
import {useConversations} from "@/hooks/chat/use-conversation";
import {useParams} from "next/navigation";
import {ConversationList} from "@/components/chat/ConversationList";




export function ConversationSidebar() {
    const { conversations , reload} = useConversations()
    const params = useParams()
    const currentId = params?.id || "";
    return(
        <div className="sticky top-4 p-2 hidden h-fit max-h-[calc(100vh-28px)] w-96 flex-col  md:flex">
            <MagicCard className="overflow-hidden p-4 pb-0 shadow-none">
                <ConversationList activeId={currentId as string} conversations={conversations} onSelect={() => {}} onNew={() => reload()} />
            </MagicCard>
        </div>

    )
}
