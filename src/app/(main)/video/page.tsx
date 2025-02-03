"use client"

import { useState } from "react"

import { Sidebar } from "./sidebar"

export default function RoutePage() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)
  return (
    <div className="flex pt-4">
      <Sidebar />
    </div>
  )
}
