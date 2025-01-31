"use client"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { X } from "react-feather"
import { toast } from "sonner"

import Message from "@/components/assistant/message"
import TextAnimation from "@/components/assistant/text-animation"
import { Role, useConversation } from "@11labs/react"

export default function RoutePage() {
  const { slug } = useParams()
  const [currentText, setCurrentText] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
  const loadConversation = () => {
    fetch(`/api/c?id=${slug}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.length > 0) {
          setMessages(
            res.map((i: any) => ({
              ...i,
              formatted: {
                text: i.content_transcript,
                transcript: i.content_transcript,
              },
            })),
          )
        }
      })
  }
  const conversation = useConversation({
    onError: (error: string) => {
      toast(error)
    },
    onConnect: () => {
      toast("Connected to ElevenLabs.")
    },
    onMessage: (props: { message: string; source: Role }) => {
      const { message, source } = props
      if (source === "ai") setCurrentText(message)
      fetch("/api/c", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: slug,
          item: {
            type: "message",
            status: "completed",
            object: "realtime.item",
            id: "item_" + Math.random(),
            role: source === "ai" ? "assistant" : "user",
            content: [{ type: "text", transcript: message }],
          },
        }),
      }).then(loadConversation)
    },
  })
  const connectConversation = useCallback(async () => {
    toast("Setting up ElevenLabs...")
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const response = await fetch("/api/i", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (data.error) return toast(data.error)
      await conversation.startSession({ signedUrl: data.apiKey })
    } catch (error) {
      toast("Failed to set up ElevenLabs client :/")
    }
  }, [conversation])
  const disconnectConversation = useCallback(async () => {
    await conversation.endSession()
  }, [conversation])
  const handleStartListening = () => {
    if (conversation.status !== "connected") connectConversation()
  }
  const handleStopListening = () => {
    if (conversation.status === "connected") disconnectConversation()
  }
  useEffect(() => {
    return () => {
      disconnectConversation()
    }
  }, [slug])
  return (
    <>
      <TextAnimation
        currentText={currentText}
        onStopListening={handleStopListening}
        onStartListening={handleStartListening}
        isAudioPlaying={conversation.isSpeaking}
      />
      {messages.length > 0 && (
        <button
          className="fixed right-4 top-2 text-sm underline"
          onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
        >
          Show Transcript
        </button>
      )}
      {isTranscriptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90%] max-w-[90%] overflow-y-scroll rounded bg-white p-4 text-black shadow-lg">
            <div className="flex flex-row items-center justify-between">
              <span>Transcript</span>
              <button onClick={() => setIsTranscriptOpen(false)}>
                <X />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-y-4 border-t py-4">
              {messages.map((conversationItem) => (
                <Message
                  key={conversationItem.id}
                  conversationItem={conversationItem}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
