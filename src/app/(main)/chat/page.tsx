"use client"

import { useUser } from "@/hooks/use-user"
import { EmptyState } from "@/app/(main)/chat/_components/EmptyState"

export default function Page() {
  const { user } = useUser()

  return (
      <div className="flex-1 flex flex-col overflow-y-hidden">
        <EmptyState username={user?.username} />
      </div>
  )
}

