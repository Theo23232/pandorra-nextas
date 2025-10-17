"use client"

import { useUser } from "@/hooks/use-user"
import {EmptyState} from "@/components/chat/EmptyState";
import {MagicCard} from "@/components/animated/magic-ui/magic-card";
import {ChatInput} from "@/components/chat/ChatInput";
import {useChat} from "@/hooks/chat/use-chat";



export default function Page() {
  const { user } = useUser();
    const {
        newMessage,
        setNewMessage,
        useWebSearch,
        setUseWebSearch,
        isLoading,
        sendMessage,
        loadingNewConversation,
    } = useChat()

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="mx-auto flex h-fit w-full max-w-3xl flex-col space-y-6 p-2 pb-0">
                <div className="flex-1 mb-24">
                    <EmptyState username={user?.username} />
                </div>
                <MagicCard className="z-50 mx-4 p-4 shadow-none">
                    <ChatInput
                        value={newMessage}
                        onChange={setNewMessage}
                        onSubmit={() => sendMessage(newMessage)}
                        isLoading={isLoading}
                        isStreaming={loadingNewConversation}
                        onStop={() => {}}
                        useWebSearch={useWebSearch}
                        onWebSearchToggle={setUseWebSearch}
                    />
                </MagicCard>
            </div>
        </div>
    )
}
