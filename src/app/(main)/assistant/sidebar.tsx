/* eslint-disable @next/next/no-img-element */
"use client"

import * as Flags from "country-flag-icons/react/3x2"
import { ChevronDown, Download, Loader, Plus } from "lucide-react"
import { useState } from "react"
import useSWR from "swr"

import { getConversationAudio } from "@/actions/assistant.actions"
import { Skeleton } from "@/components/nyxb/skeleton"
import { Card } from "@/components/tremor/ui/card"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { getLangageNameByCode } from "@/lib/elevenlabs/langList"
import { getVoiceNameById } from "@/lib/elevenlabs/voiceList"
import { formatTimePassed } from "@/lib/utils"

import { Conversation } from "./conversation"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const languageToCountry: { [key: string]: keyof typeof Flags } = {
  en: "GB",
  fr: "FR",
  ar: "SA",
  bg: "BG",
  zh: "CN",
  hr: "HR",
  da: "DK",
  de: "DE",
  el: "GR",
  hi: "IN",
  it: "IT",
  ja: "JP",
  ko: "KR",
  pl: "PL",
  pt: "PT",
  ms: "MY",
  ro: "RO",
  ru: "RU",
  es: "ES",
  sk: "SK",
  sv: "SE",
  tr: "TR",
  uk: "UA",
}

interface SidebarProps {
  onSelectConversation: (conversationId: string) => void
}

export function Sidebar({ onSelectConversation }: SidebarProps) {
  const { data, error } = useSWR("/api/assistant", fetcher)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [downloadingId, setDownloadingId] = useState("")
  const [activeConversationId, setActiveConversationId] = useState("")

  const [selectedAgent, setSelectedAgent] = useState<{
    id: string
    voiceId: string
    language: string
  } | null>(null)

  const handleDownload = async (convId: string) => {
    setDownloadingId(convId)
    const blob = await getConversationAudio(convId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `conversation-${convId}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setDownloadingId("")
  }

  if (error) return <div>Failed to load</div>
  if (!data)
    return (
      <Card className="h-fit max-h-[80vh] w-96 border-l bg-background p-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4 w-full">
              <Plus className="mr-2 h-4 w-4" /> Create Discussion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Conversation
              onClose={() => setIsDialogOpen(false)}
              preSelectedAgentId={selectedAgent?.id}
              preSelectedVoiceId={selectedAgent?.voiceId}
              preSelectedLanguage={selectedAgent?.language}
            />
          </DialogContent>
        </Dialog>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between">
            <h3 className="text-lg font-semibold">Agents</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Skeleton className="mb-2 h-[60px] w-full" />
            <Skeleton className="mb-2 h-[60px] w-full" />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen className="mt-4">
          <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between">
            <h3 className="text-lg font-semibold">Conversations</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Skeleton className="mb-2 h-[52px] w-full" />
            <Skeleton className="mb-2 h-[52px] w-full" />
          </CollapsibleContent>
        </Collapsible>
      </Card>
    )

  const { agents } = data

  const handleAgentClick = (agent: any) => {
    setSelectedAgent({
      id: agent.id,
      voiceId: agent.voiceId,
      language: agent.language,
    })
    setIsDialogOpen(true)
  }

  return (
    <Card className="sticky top-20 h-fit max-h-[70vh] w-96 overflow-y-auto border-l bg-background p-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 w-full">
            <Plus className="mr-2 h-4 w-4" /> Create Discussion
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Conversation
            onClose={() => setIsDialogOpen(false)}
            preSelectedAgentId={selectedAgent?.id}
            preSelectedVoiceId={selectedAgent?.voiceId}
            preSelectedLanguage={selectedAgent?.language}
          />
        </DialogContent>
      </Dialog>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between">
          <h3 className="text-lg font-semibold">Agents</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {agents.map((agent: any) => {
            const CountryFlag = Flags[languageToCountry[agent.language] || "GB"]
            return (
              <div
                key={agent.id}
                className="mb-2 flex cursor-pointer items-center rounded-md p-2 hover:bg-muted"
                onClick={() => handleAgentClick(agent)}
              >
                <img
                  src={`https://api.dicebear.com/9.x/glass/svg?seed=${agent.id}&backgroundType=solid,gradientLinear&randomizeIds=true`}
                  alt={`Agent ${agent.id}`}
                  className="mr-2 h-8 w-8 rounded-full"
                />
                <div>
                  <p className="font-medium">
                    Agent {getVoiceNameById(agent.voiceId)}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CountryFlag className="mr-1 h-4 w-4" />
                    {getLangageNameByCode(agent.language)}
                  </p>
                </div>
              </div>
            )
          })}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen className="mt-4">
        <CollapsibleTrigger className="mb-2 flex w-full items-center justify-between">
          <h3 className="text-lg font-semibold">Conversations</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {[...agents]
            .flatMap((agent: any) => agent.Conversation)
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((conversation: any) => {
              const timePassed = formatTimePassed(conversation.createdAt)
              return (
                <div
                  key={conversation.id}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-center gap-2">
                    <span>{getVoiceNameById(conversation.agent.voiceId)}</span>
                    <span className="text-xs text-muted-foreground">
                      {timePassed}
                    </span>
                  </div>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(conversation.id)
                    }}
                  >
                    {downloadingId == conversation.id ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )
            })}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
