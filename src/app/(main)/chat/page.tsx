"use client"
import { useState } from 'react';

import { useUser } from '@/hooks/use-user';

import { ConversationList } from './ConversationList';
import { MessagePanel } from './MessagePanel';

export default function Home() {
  const { user, isLoading, isError } = useUser()
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)

  if (isLoading) return <p>Loading...</p>
  if (isError || !user) return <p>Error loading user or unauthorized</p>

  return (
    <div className="flex h-screen">
      <ConversationList
        userId={user.id}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />
      <MessagePanel conversationId={selectedConversationId} />
    </div>
  )
}
