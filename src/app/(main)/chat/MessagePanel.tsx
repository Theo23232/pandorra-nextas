"use client"

import axios from 'axios';
import { Loader, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { postMessage } from '@/actions/chat.actions';
import { Textarea } from '@/components/tremor/inputs/textarea';
import { Button } from '@/components/tremor/ui/button';

interface MessagePanelProps {
  conversationId: string | null
}

export function MessagePanel({ conversationId }: MessagePanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
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
  }, [])
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!newMessage.trim() || !conversationId) return
    const { userMessage, assistantMessage } = await postMessage(
      conversationId.toString(),
      newMessage,
    )

    // Ajouter les nouveaux messages à la liste
    setMessages([
      ...messages,
      {
        id: userMessage.id,
        content: userMessage.content,
        role: userMessage.role,
      },
      {
        id: assistantMessage.id,
        content: assistantMessage.content,
        role: assistantMessage.role,
      },
    ])
    setIsLoading(false)

    setNewMessage("")
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div className="flex h-full max-w-5xl flex-col">
      {conversationId ? (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                <strong>
                  {message.role === "user" ? "You" : "Assistant"}:
                </strong>
                <ReactMarkdown className="ml-2">
                  {message.content}
                </ReactMarkdown>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            className="sticky bottom-0 border-t border-border bg-background p-4"
            onSubmit={sendMessage}
          >
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleInput}
              className="w-full resize-none overflow-hidden border-0 pt-2 text-base shadow-none focus-visible:ring-0"
              placeholder="Type your message..."
              rows={1}
            />
            <div className="mt-2 flex justify-end">
              <Button type="submit">
                {isLoading ? <Loader className="animate-spin" /> : <Send />}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <p className="p-4">Select a conversation to start messaging.</p>
      )}
    </div>
  )
}
