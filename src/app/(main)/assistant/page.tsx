"use client"

import { useState } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

import { ConversationDetails } from "./conversation-details"
import { Conversation } from "./mainConversation"
import { Sidebar, SidebarDialog } from "./sidebar"

export default function Home() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)
  const [selectedAgent, setSelectedAgent] = useState<{
    id: string
    voiceId: string
    lang: string
  }>()

  const handleSelectAgent = (id: string, voiceId: string, lang: string) => {
    setSelectedAgent({ id, voiceId, lang })
  }

  return (
    <div className="flex pt-4">
      <SidebarDialog
        onSelectConversation={setSelectedConversation}
        onSelectAgent={handleSelectAgent}
      />
      <div className="hidden lg:block">
        <Sidebar
          onSelectConversation={setSelectedConversation}
          onSelectAgent={handleSelectAgent}
        />
      </div>

      <ScrollArea className="w-full p-6 pt-0">
        {selectedConversation ? (
          <ConversationDetails conversationId={selectedConversation} />
        ) : (
          <Conversation selectedAgent={selectedAgent!} />
        )}
      </ScrollArea>
    </div>
  )
}
