"use client"

import axios from 'axios';
import { Send, StopCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { MagicCard } from '@/components/animated/magic-ui/magic-card';
import { Button } from '@/components/tremor/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { Message } from './message';

interface MessagePanelProps {
  conversationId: string | null
}

export function MessagePanel({ conversationId }: MessagePanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!conversationId) return

    const fetchMessages = async () => {
      const { data } = await axios.get(
        `/api/conversations/one?id=${conversationId}`,
      )
      setMessages(data.messages)
    }

    fetchMessages()
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsStreaming(true)

    if (!newMessage.trim() || !conversationId) return

    const controller = new AbortController()
    setAbortController(controller)

    try {
      // Envoyer le message utilisateur
      const userMessage = {
        id: Date.now().toString(),
        content: newMessage,
        role: "user",
      }
      setMessages((prev) => [...prev, userMessage])

      // Appeler l'API avec streaming
      const response = await fetch(`/api/chat`, {
        method: "POST",
        body: JSON.stringify({ conversationId, content: newMessage }),
        signal: controller.signal,
      })

      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      let assistantMessageContent = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        assistantMessageContent += chunk

        // Mettre à jour le message assistant en temps réel
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage?.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: assistantMessageContent },
            ]
          } else {
            return [
              ...prev,
              {
                id: Date.now().toString(),
                content: assistantMessageContent,
                role: "assistant",
              },
            ]
          }
        })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setAbortController(null)
    }
  }

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort()
      setIsStreaming(false)
      setIsLoading(false)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
      {conversationId ? (
        <>
          <div className="min-h-[calc(100vh-204px)] flex-1 p-4">
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                <Message content={message.content} role={message.role} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <MagicCard className="sticky bottom-8 z-50 p-4">
            <form onSubmit={sendMessage} className="flex">
              <Textarea
                ref={textareaRef}
                value={newMessage}
                onChange={handleInput}
                className="max-h-48 w-full resize-none overflow-y-auto border-0 bg-transparent pt-2 text-base shadow-none focus-visible:ring-0"
                placeholder="Type your message..."
                rows={1}
              />
              <div className="flex items-end">
                {isStreaming ? (
                  <Button
                    type="button"
                    onClick={stopGeneration}
                    className="flex h-10 w-10 items-center justify-center p-0"
                  >
                    <StopCircle size={20} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex h-10 w-10 items-center justify-center p-0"
                  >
                    <Send size={20} />
                  </Button>
                )}
              </div>
            </form>
          </MagicCard>
        </>
      ) : (
        <p className="p-4">Select a conversation to start messaging.</p>
      )}
    </div>
  )
}
