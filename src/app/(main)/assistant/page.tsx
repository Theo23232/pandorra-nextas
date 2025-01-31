"use client"

import { useState } from "react"

import { Conversation } from "./conversation"
import { ConversationDetails } from "./conversation-details"
import { Sidebar } from "./sidebar"

export default function Home() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)

  return (
    <div className="flex max-h-[calc(100vh-64px)]">
      <Sidebar onSelectConversation={setSelectedConversation} />

      <main className="w-full overflow-auto p-6 pt-0">
        {selectedConversation ? (
          <ConversationDetails conversationId={selectedConversation} />
        ) : (
          <Conversation
            onClose={undefined}
            preSelectedAgentId={undefined}
            preSelectedVoiceId={undefined}
            preSelectedLanguage={undefined}
          />
        )}
      </main>
    </div>
  )
}
