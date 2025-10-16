import React , { Suspense } from 'react'
import { MagicCard } from '@/components/animated/magic-ui/magic-card'
import {ConversationSidebar} from "@/components/chat/ConversationSidebar";




export default function ChatLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <MagicCard className="h-[calc(100vh-80px)] rounded-xl">
            <div className="flex  h-full flex-row pl-4 pr-0">
                <ConversationSidebar />
                <div className="flex-1 flex flex-col overflow-y-hidden">
                    {children}
                </div>
            </div>
        </MagicCard>
    )
}
