import { ReactNode } from "react"
import { ChatLayout } from "@/app/(main)/chat/_components/ChatLayout"
import { ConversationList } from "@/app/(main)/chat/_components/ConversationList"

interface ChatLayoutProps {
    children: ReactNode
}

export default function Layout({ children }: ChatLayoutProps) {
    return (
        <ChatLayout>
            <div className="flex h-full w-full">
                <ConversationList />
                <div className="flex-1 flex flex-col overflow-y-hidden">
                    {children}
                </div>
            </div>
        </ChatLayout>
    )
}


