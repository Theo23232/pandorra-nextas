"use client"

import axios from "axios"
import {
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Send,
  StopCircle,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import useSWR, { mutate } from "swr"

import { reduceCredit } from "@/actions/credits.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import Bounce from "@/components/animated/uibeats/bounce"
import { Button } from "@/components/tremor/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { cn, fetcher } from "@/lib/utils"

import { Message } from "./message"

export default function Page() {
  const [conversationId, setConversationId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)
  const [sheetIsOpen, setSheetIsOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState<Boolean>(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { data: conversations, error } = useSWR<any[]>(
    "/api/conversations",
    fetcher,
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const closeDialog = () => {
    setIsDialogOpen(false)
    setDialogOpen(false)
  }

  const openDialog = () => {
    setIsDialogOpen(true)
    setDialogOpen(true)
  }

  const createConversation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (user?.jeton) {
      const { data } = await axios.post("/api/conversations", {
        firstPrompt: newMessage,
      })
      mutate("/api/conversations")
      setConversationId(data.id)
      sendMessage(newMessage, data.id)
    } else {
      toast({
        title: t(`Error`),
        description: t(`You do not have enought token for this message`),
        variant: "error",
      })
      return
    }
  }

  const { t } = useTranslation()

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

  const sendMessage = async (newMess: string, convId: string) => {
    setNewMessage("")
    setIsLoading(true)
    setIsStreaming(true)
    if (!newMess.trim() || !convId) {
      setIsLoading(false)
      setIsStreaming(false)
      return
    }

    const controller = new AbortController()
    setAbortController(controller)

    try {
      // Envoyer le message utilisateur
      const userMessage = {
        id: Date.now().toString(),
        content: newMess,
        role: "user",
      }
      setMessages((prev) => [...prev, userMessage])

      // Appeler l'API avec streaming
      const response = await fetch(`/api/chat`, {
        method: "POST",
        body: JSON.stringify({ conversationId: convId, content: newMess }),
        signal: controller.signal,
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
        },
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
      await reduceCredit(1)
      mutate("/api/auth/session")
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
    <MagicCard className="rounded-xl">
      <div className="flex flex-row p-4">
        <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
          <SheetTrigger asChild>
            <button
              className="fixed bottom-36 left-4 z-50 block rounded-full bg-blue-500 p-2 text-white md:hidden"
              onClick={openDialog}
            >
              {!dialogOpen ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelLeftOpen size={20} />
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="">
            <div className="p-4 pb-0">
              <Button
                onClick={() => {
                  setConversationId("")
                }}
                className="w-full"
              >
                <Plus className="mr-2" /> {t(`Start Conversation`)}
              </Button>
              <ScrollArea className="h-[calc(100vh-120px)]">
                {conversations ? (
                  <Bounce className="mt-4 pr-4">
                    {conversations?.map((conversation) => (
                      <Button
                        key={conversation.id}
                        variant={`${
                          conversationId === conversation.id
                            ? "outline"
                            : "ghost"
                        }`}
                        className={cn(
                          "relative w-full max-w-[350px] justify-start truncate",
                          conversationId === conversation.id
                            ? "bg-gray-100 text-primary dark:bg-gray-900"
                            : "",
                        )}
                        onClick={() => setConversationId(conversation.id)}
                      >
                        {conversation.title}
                      </Button>
                    ))}
                  </Bounce>
                ) : (
                  <></>
                )}
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
        <Bounce className="sticky top-4 hidden h-fit max-h-[calc(100vh-20px)] w-96 bg-card md:block">
          <MagicCard className="overflow-hidden p-4 pb-0">
            <Button
              onClick={() => {
                setConversationId("")
              }}
              className="w-full"
            >
              <Plus className="mr-2" /> {t(`Start Conversation`)}
            </Button>
            <ScrollArea className="h-[calc(100vh-160px)]">
              {conversations ? (
                <Bounce className="mt-4 pr-4">
                  {conversations?.map((conversation) => (
                    <Button
                      key={conversation.id}
                      variant={`${
                        conversationId === conversation.id ? "outline" : "ghost"
                      }`}
                      className={cn(
                        "relative w-full max-w-[350px] justify-start truncate",
                        conversationId === conversation.id
                          ? "bg-gray-100 text-primary dark:bg-gray-900"
                          : "",
                      )}
                      onClick={() => setConversationId(conversation.id)}
                    >
                      {conversation.title}
                    </Button>
                  ))}
                </Bounce>
              ) : (
                <></>
              )}
            </ScrollArea>
          </MagicCard>
        </Bounce>

        <Bounce className="mx-auto flex h-full w-full max-w-3xl flex-col p-2 pb-0">
          {conversationId ? (
            <>
              <div className="min-h-[calc(100vh-204px)] flex-1 p-4">
                {messages.map((message) => (
                  <div key={message.id} className="mb-4">
                    <Message
                      content={message.content}
                      role={message.role}
                      isStreaming={
                        isStreaming &&
                        message.role === "assistant" &&
                        message === messages[messages.length - 1]
                      }
                      isLoading={
                        isStreaming &&
                        message.role === "assistant" &&
                        message === messages[messages.length - 1]
                      }
                    />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <MagicCard className="sticky bottom-4 z-50 p-4">
                <div className="flex">
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
                        onClick={() => sendMessage(newMessage, conversationId)}
                        className="flex h-10 w-10 items-center justify-center p-0"
                      >
                        <Send size={20} />
                      </Button>
                    )}
                  </div>
                </div>
              </MagicCard>
            </>
          ) : (
            <>
              <div className="flex min-h-[calc(100vh-204px)] flex-1 items-center justify-center p-4">
                <Bounce>
                  <div className="font-inter text-center text-[40px] font-semibold leading-[78px] text-black md:text-[50px] dark:text-[#FDFDFD]">
                    {t(`Hello,`)}
                    <span className="ml-4 bg-gradient-to-r from-[#CC00FF] to-[#0099FF] bg-clip-text capitalize text-transparent">
                      {user?.username}
                    </span>
                  </div>
                  <Alert className="max-w-md border border-border">
                    <Megaphone className="h-4 w-4" />
                    <AlertTitle>{t(`Announcement`)}!</AlertTitle>
                    <AlertDescription>
                      {t(
                        `Pandorra chat currently costs 1 credit per message but will soon be free and unlimited.`,
                      )}
                    </AlertDescription>
                  </Alert>
                </Bounce>
                <p> </p>
                <div ref={messagesEndRef} />
              </div>
              <MagicCard className="sticky bottom-4 z-50 p-4">
                <form onSubmit={createConversation} className="flex">
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
          )}
        </Bounce>
      </div>
    </MagicCard>
  )
}
