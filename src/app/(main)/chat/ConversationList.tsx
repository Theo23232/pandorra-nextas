"use client"
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { MagicCard } from '@/components/animated/magic-ui/magic-card';
import { Button } from '@/components/tremor/ui/button';

interface ConversationListProps {
  userId: string
  selectedConversationId: string | null
  onSelectConversation: (id: string) => void
}

export function ConversationList({
  userId,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<any[]>([])

  useEffect(() => {
    async function fetchConversations() {
      const { data } = await axios.get("/api/conversations")
      setConversations(data)
    }
    fetchConversations()
  }, [])

  const createConversation = async () => {
    const title = prompt("Enter a conversation title:")
    if (!title) return
    const { data } = await axios.post("/api/conversations", { title })
    setConversations([...conversations, data])
  }

  return (
    <MagicCard className="sticky top-20 h-fit max-h-[70vh] w-96 overflow-y-auto border-l bg-card p-4">
      <Button onClick={createConversation}>
        <Plus className="mr-2" /> New Conversation
      </Button>
      <div className="mt-4">
        {conversations.map((conversation) => (
          <Button
            key={conversation.id}
            variant={`${
              selectedConversationId === conversation.id ? "outline" : "ghost"
            }`}
            className="w-full justify-start"
            onClick={() => onSelectConversation(conversation.id)}
          >
            {conversation.title}
          </Button>
        ))}
      </div>
    </MagicCard>
  )
}
