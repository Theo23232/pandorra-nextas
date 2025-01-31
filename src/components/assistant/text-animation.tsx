"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import { useTypingEffect } from "@/hooks/useTypingEffect"

type AIState = "idle" | "listening" | "speaking"
interface Props {
  onStartListening?: () => void
  onStopListening?: () => void
  isAudioPlaying?: boolean
  currentText: string
}
export default function AiTalkingAnimation({
  onStartListening,
  onStopListening,
  isAudioPlaying,
  currentText,
}: Props) {
  const [aiState, setAiState] = useState<AIState>("idle")
  const animatedCurrentText = useTypingEffect(currentText, 20)
  const displayedText = useTypingEffect(
    "Click the circle to start the conversation",
    20,
  )
  const handleCircleClick = () => {
    if (aiState === "listening" || aiState === "speaking") {
      onStopListening?.()
      setAiState("idle")
    } else if (!isAudioPlaying) {
      onStartListening?.()
      setAiState("listening")
    }
  }
  useEffect(() => {
    if (isAudioPlaying) setAiState("speaking")
    else if (aiState === "speaking" && currentText) setAiState("listening")
  }, [isAudioPlaying])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div
        role="button"
        onClick={handleCircleClick}
        className="relative mb-8 cursor-pointer"
        aria-label={
          aiState === "listening" ? "Stop listening" : "Start listening"
        }
      >
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-600 shadow-lg"
          animate={
            aiState === "idle"
              ? { scale: [1, 1.1, 1] }
              : aiState === "speaking"
                ? { scale: [1, 1.2, 0.8, 1.2, 1] }
                : {}
          }
          transition={{
            repeat: Infinity,
            ease: "easeInOut",
            duration: aiState === "speaking" ? 0.8 : 1.5,
          }}
        />
        {aiState === "listening" && (
          <svg
            viewBox="0 0 100 100"
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              strokeWidth="4"
              stroke="#8B5CF6"
              transition={{
                duration: 10,
                ease: "linear",
                repeat: Infinity,
              }}
              strokeLinecap="round"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: 270 }}
            />
          </svg>
        )}
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <p className="font-mono text-lg text-gray-800" aria-live="polite">
          {aiState === "listening"
            ? "Listening..."
            : aiState === "speaking"
              ? animatedCurrentText
              : displayedText}
        </p>
        {aiState === "idle" && (
          <motion.div
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mt-2 h-5 w-2 bg-violet-600"
          />
        )}
      </div>
    </div>
  )
}
