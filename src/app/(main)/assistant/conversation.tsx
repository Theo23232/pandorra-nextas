"use client"

import { motion } from "framer-motion"
import { Mic, MicOff, StopCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { mutate } from "swr"

import { createAgent, saveConversation } from "@/actions/assistant.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tremor/inputs/select"
import { Button } from "@/components/tremor/ui/button"
import { CardTitle } from "@/components/tremor/ui/card"
import { languageOptions } from "@/lib/elevenlabs/langList"
import { voicesList } from "@/lib/elevenlabs/voiceList"
import { useConversation } from "@11labs/react"

interface ConversationProps {
  onClose?: () => void
  preSelectedAgentId?: string
  preSelectedVoiceId?: string
  preSelectedLanguage?: string
}

export function Conversation({
  onClose,
  preSelectedAgentId,
  preSelectedVoiceId,
  preSelectedLanguage,
}: ConversationProps) {
  const [lang, setLang] = useState(preSelectedLanguage || "en")
  const [agentId, setAgentId] = useState(preSelectedAgentId || "")
  const [voiceId, setVoiceId] = useState(preSelectedVoiceId || voicesList[0].id)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (preSelectedAgentId) setAgentId(preSelectedAgentId)
    if (preSelectedVoiceId) setVoiceId(preSelectedVoiceId)
    if (preSelectedLanguage) setLang(preSelectedLanguage)
  }, [preSelectedAgentId, preSelectedVoiceId, preSelectedLanguage])

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  })

  const startConversation = useCallback(async () => {
    setIsLoading(true)
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!agentId) {
        const agent = await createAgent({ language: lang, voiceId })
        setAgentId(agent.id)
        await conversation.startSession({ agentId: agent.id })
      } else {
        await conversation.startSession({ agentId })
      }
    } catch (error) {
      console.error("Failed to start conversation:", error)
    } finally {
      setIsLoading(false)
    }
  }, [conversation, lang, voiceId, agentId])

  const stopConversation = useCallback(async () => {
    setIsLoading(true)

    await conversation.endSession()
    await saveConversation(agentId)
    mutate("/api/assistant")
    setIsLoading(false)
    if (onClose) onClose()
  }, [conversation, agentId, onClose])

  return (
    <MagicCard
      gradientSize={700}
      className="flex min-h-96 w-full max-w-2xl flex-col items-center justify-center gap-4 p-8"
    >
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <AnimatedGradientCircle isSpeaking={conversation.isSpeaking} />
        <CardTitle className="mt-4 font-bold">
          {preSelectedAgentId
            ? "Continue Conversation"
            : "Start New Conversation"}
        </CardTitle>

        <Select
          value={voiceId}
          onValueChange={setVoiceId}
          disabled={!!preSelectedVoiceId}
        >
          <SelectTrigger className="h-[50px] w-[300px]">
            <SelectValue placeholder="Select Voice" />
          </SelectTrigger>
          <SelectContent>
            {voicesList.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={lang}
          onValueChange={setLang}
          disabled={!!preSelectedLanguage}
        >
          <SelectTrigger className="h-[50px] w-[300px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((item) => (
              <SelectItem key={item.code} value={item.code}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {conversation.status !== "connected" ? (
          <Button
            onClick={startConversation}
            className="w-[300px] gap-2"
            isLoading={isLoading}
          >
            <Mic className={`h-4 w-4 ${isLoading ?? "hidden"}`} /> Start
            Conversation
          </Button>
        ) : (
          <Button
            onClick={stopConversation}
            variant="destructive"
            className="w-[300px] gap-2"
            isLoading={isLoading}
          >
            <StopCircle className={`h-4 w-4 ${isLoading ?? "hidden"}`} /> Stop
            Conversation
          </Button>
        )}

        {conversation.status === "connected" && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {conversation.isSpeaking ? (
              <>
                <Mic className="h-4 w-4 text-green-500" />
                <span>Agent is speaking</span>
              </>
            ) : (
              <>
                <MicOff className="h-4 w-4 text-gray-500" />
                <span>Agent is listening</span>
              </>
            )}
          </div>
        )}
      </div>
    </MagicCard>
  )
}

const AnimatedGradientCircle = ({ isSpeaking }) => {
  return (
    <motion.div
      className="relative size-36"
      animate={{
        scale: isSpeaking ? [1, 1.3, 1] : 1,
        transition: {
          duration: isSpeaking ? 0.5 : 2,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut",
        },
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(45deg, #ff6b6b, #DCED31, #009FB7, #FC7A1E)",
          backgroundSize: "400% 400%",
          filter: "blur(20px)",
          animation: "gradient-shift 3s ease infinite",
        }}
      />
      <style jsx global>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.div>
  )
}
