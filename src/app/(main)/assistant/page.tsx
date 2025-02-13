"use client"

import { useState } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

import { ConversationDetails } from "./conversation-details"
import { Conversation } from "./mainConversation"
import { Sidebar } from "./sidebar"

export default function Home() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)

  return (
    <div className="flex pt-4">
      <Sidebar onSelectConversation={setSelectedConversation} />

      <ScrollArea className="w-full p-6 pt-0">
        {selectedConversation ? (
          <ConversationDetails conversationId={selectedConversation} />
        ) : (
          <Conversation />
        )}
      </ScrollArea>
    </div>
  )
}
