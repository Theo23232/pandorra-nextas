"use client"

import type React from "react"

import axios from "axios"
import {
  Globe,
  Loader,
  Megaphone,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Send,
  StopCircle,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import useSWR, { mutate } from "swr"

import { editMessage } from "@/actions/chat.actions"
import { reduceCredit } from "@/actions/credits.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import Bounce from "@/components/animated/uibeats/bounce"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useShowZeroPayement } from "@/hooks/use-show-zero-payement"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { cn, fetcher } from "@/lib/utils"
import { Message as MessageType, ReactionMessage } from "@prisma/client"

import { Message } from "./message"

export default function Page() {
  const { show } = useShowZeroPayement()
  const { t } = useTranslation()
  const { toast } = useToast()
  const { user } = useUser()

  const [conversationId, setConversationId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)
  const [sheetIsOpen, setSheetIsOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [useWebSearch, setUseWebSearch] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
        description: t(`You do not have enough token for this message`),
        variant: "error",
      })
      return
    }
  }

  useEffect(() => {
    if (!conversationId) return

    const fetchMessages = async () => {
      const { data } = await axios.get(
        `/api/conversations/one?id=${conversationId}`,
      )
      setMessages(data.messages)
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
    }

    fetchMessages()
  }, [conversationId])

  const sendMessage = async (newMess: string, convId: string) => {
    if (user?.jeton == 0) {
      show()
      return
    }
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    try {
      // Envoyer le message utilisateur
      const userMessage: MessageType = {
        id: Date.now().toString(),
        content: newMess,
        role: "user",
        gptConversationId: conversationId,
        createdAt: new Date(),
        reaction: null,
      }
      setMessages((prev) => [...prev, userMessage])

      // Appeler l'API avec streaming
      const response = await fetch(`/api/chat`, {
        method: "POST",
        body: JSON.stringify({
          conversationId: convId,
          content: newMess,
          useWebSearch: useWebSearch,
        }),
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
                gptConversationId: conversationId,
                createdAt: new Date(),
                reaction: null,
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

  // Message action handlers
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: t("Copied"),
      description: t("Message copied to clipboard"),
      variant: "success",
    })
  }

  const handleEditMessage = (id: string, content: string) => {
    setEditingMessage(id)
    setEditingContent(content)
  }

  const handleSaveEdit = async (id: string) => {
    try {
      // Update the message in the UI
      setMessages(
        messages.map((msg) =>
          msg.id === id ? { ...msg, content: editingContent } : msg,
        ),
      )

      // Update in the database
      await editMessage(id, editingContent)
      // Reset editing state
      setEditingMessage(null)
      setEditingContent("")

      // Regenerate the AI response
      const messageIndex = messages.findIndex((msg) => msg.id === id)
      if (messageIndex >= 0 && messageIndex < messages.length - 1) {
        const nextMessage = messages[messageIndex + 1]
        if (nextMessage.role === "assistant") {
          // Remove the AI message and regenerate
          setMessages(messages.filter((msg) => msg.id !== nextMessage.id))
          sendMessage(editingContent, conversationId)
        }
      }
    } catch (error) {
      console.error("Error updating message:", error)
      toast({
        title: t("Error"),
        description: t("Failed to update message"),
        variant: "error",
      })
    }
  }

  const handleRegenerateResponse = async (messageIndex: number) => {
    if (messageIndex <= 0 || messageIndex >= messages.length) return

    const userMessage = messages[messageIndex - 1]
    if (userMessage.role !== "user") return

    // Remove the current AI message
    setMessages(messages.filter((_, i) => i !== messageIndex))

    // Regenerate response
    sendMessage(userMessage.content, conversationId)
  }

  const handleReaction = async (id: string, reactionType: ReactionMessage) => {
    try {
      // Update UI optimistically

      toast({
        title: "",
        description: "Feedback sent!",
        variant: "success",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error setting reaction:", error)
      toast({
        title: t("Error"),
        description: t("Failed to record your reaction"),
        variant: "error",
      })
    }
  }

  return (
    <MagicCard className="max-h-[calc(100vh-80px)] rounded-xl">
      <div className="flex flex-row pl-4 pr-0">
        <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
          <SheetTrigger asChild>
            <button
              className="fixed bottom-44 right-8 z-50 block rounded-full bg-blue-500 p-2 text-white md:hidden"
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
              <ScrollArea className="h-[calc(100vh-112px)]">
                {conversations ? (
                  <Bounce once={true} className="mt-4 pr-4">
                    {conversations?.map((conversation) => (
                      <Button
                        key={conversation.id}
                        variant={`${conversationId === conversation.id ? "outline" : "ghost"}`}
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
        <div className="sticky top-4 hidden h-fit max-h-[calc(100vh-28px)] w-96 flex-col bg-card md:flex">
          <MagicCard className="overflow-hidden p-4 pb-0 shadow-none">
            <Button
              onClick={() => {
                setConversationId("")
              }}
              className="w-full"
            >
              <Plus className="mr-2" /> {t(`Start Conversation`)}
            </Button>
            <ScrollArea className="h-[calc(100vh-168px)]">
              {conversations ? (
                <Bounce once={true} className="mt-4 pr-4">
                  {conversations?.map((conversation) => (
                    <Button
                      key={conversation.id}
                      variant={`${conversationId === conversation.id ? "outline" : "ghost"}`}
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
        </div>

        <div className="h-full max-h-[calc(100vh-80px)] w-full overflow-y-scroll py-[4px]">
          <div className="mx-auto flex h-fit w-full max-w-3xl flex-col p-2 pb-0">
            {conversationId ? (
              <>
                <div className="min-h-[calc(100vh-204px)] flex-1 p-4">
                  {messages.map((message, index) => (
                    <div key={message.id} className="mb-4">
                      {editingMessage === message.id ? (
                        <div className="ml-auto w-fit max-w-xl rounded-3xl bg-muted p-2">
                          <Textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="min-h-[100px] resize-none border-0 bg-transparent p-2"
                          />
                          <div className="flex justify-end gap-2 p-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingMessage(null)
                                setEditingContent("")
                              }}
                            >
                              {t("Cancel")}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(message.id)}
                            >
                              {t("Save")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Message
                          content={message.content}
                          id={message.id}
                          role={message.role}
                          reaction={message.reaction}
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
                          onCopy={() => handleCopyMessage(message.content)}
                          onEdit={
                            message.role === "user"
                              ? () =>
                                  handleEditMessage(message.id, message.content)
                              : undefined
                          }
                          onRegenerate={
                            message.role === "assistant"
                              ? () => handleRegenerateResponse(index)
                              : undefined
                          }
                          onLike={
                            message.role === "assistant"
                              ? () => handleReaction(message.id, "like")
                              : undefined
                          }
                          onDislike={
                            message.role === "assistant"
                              ? () => handleReaction(message.id, "dislike")
                              : undefined
                          }
                        />
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} className="pb-12" />
                </div>
                <MagicCard className="sticky bottom-4 z-50 p-4 shadow-none">
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <Textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={handleInput}
                        className="max-h-48 w-full resize-none overflow-y-auto border-0 bg-transparent pt-2 text-base shadow-none focus-visible:ring-0"
                        placeholder={
                          useWebSearch
                            ? "Ask me anything with web search..."
                            : "Type your message..."
                        }
                        rows={1}
                      />
                      <div className="flex w-full items-end justify-between">
                        <div className="mb-2 flex items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Toggle
                                  aria-label="Toggle web search"
                                  pressed={useWebSearch}
                                  onPressedChange={setUseWebSearch}
                                  className={`mr-2 h-8 border border-border px-2 ${useWebSearch ? "border-primary bg-blue-500/20 text-primary hover:bg-blue-500/40 hover:text-primary" : ""}`}
                                >
                                  <Globe className="mr-1 h-4 w-4" />
                                  Web
                                </Toggle>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Enable web search for up-to-date information
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {isLoading && !isStreaming && (
                          <Button
                            type="button"
                            onClick={stopGeneration}
                            className="flex h-8 w-10 items-center justify-center p-0"
                          >
                            <Loader className="animate-spin" size={20} />
                          </Button>
                        )}
                        {isStreaming ? (
                          <Button
                            type="button"
                            onClick={stopGeneration}
                            className="flex h-8 w-10 items-center justify-center p-0"
                          >
                            <StopCircle size={20} />
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              sendMessage(newMessage, conversationId)
                            }
                            className="flex h-8 w-10 items-center justify-center p-0"
                          >
                            {useWebSearch ? (
                              <Search size={20} />
                            ) : (
                              <Send size={20} />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </MagicCard>
              </>
            ) : (
              <>
                <div className="flex min-h-[calc(100vh-204px)] flex-1 items-center justify-center overflow-y-auto p-4">
                  <Bounce once={true}>
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
                <MagicCard className="sticky bottom-4 z-50 p-4 shadow-none">
                  <form onSubmit={createConversation} className="flex flex-col">
                    <div className="flex flex-col">
                      <Textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={handleInput}
                        className="max-h-48 w-full resize-none overflow-y-auto border-0 bg-transparent pt-2 text-base shadow-none focus-visible:ring-0"
                        placeholder={
                          useWebSearch
                            ? "Ask me anything with web search..."
                            : "Type your message..."
                        }
                        rows={1}
                      />
                      <div className="flex w-full items-end justify-between">
                        <div className="mb-2 flex items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Toggle
                                  aria-label="Toggle web search"
                                  pressed={useWebSearch}
                                  onPressedChange={setUseWebSearch}
                                  className={`mr-2 h-8 border border-border px-2 ${useWebSearch ? "border-primary bg-blue-500/20 text-primary hover:bg-blue-500/40 hover:text-primary" : ""}`}
                                >
                                  <Globe className="mr-1 h-4 w-4" />
                                  Web
                                </Toggle>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Enable web search for up-to-date information
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {isLoading && !isStreaming && (
                          <Button
                            type="button"
                            onClick={stopGeneration}
                            className="flex h-8 w-10 items-center justify-center p-0"
                          >
                            <Loader className="animate-spin" size={20} />
                          </Button>
                        )}
                        {isStreaming ? (
                          <Button
                            type="button"
                            onClick={stopGeneration}
                            className="flex h-8 w-10 items-center justify-center p-0"
                          >
                            <StopCircle size={20} />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="flex h-8 w-10 items-center justify-center p-0"
                          >
                            {useWebSearch ? (
                              <Search size={20} />
                            ) : (
                              <Send size={20} />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </form>
                </MagicCard>
              </>
            )}
          </div>
        </div>
      </div>
    </MagicCard>
  )
}
