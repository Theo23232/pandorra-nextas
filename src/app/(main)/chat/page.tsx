"use client"

import { useUser } from "@/hooks/use-user"
import {EmptyState} from "@/components/chat/EmptyState";



export default function Page() {
  const { user } = useUser()

  return (
      <div className="flex-1 flex flex-col h-full">
        <EmptyState username={user?.username} />
      </div>
  )
}
