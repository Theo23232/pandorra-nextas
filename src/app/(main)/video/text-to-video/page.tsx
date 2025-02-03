"use client"
import { useRef, useState } from "react"

import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function Page() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [prompt, setPrompt] = useState("")
  const charCount = prompt.length
  const maxChars = 9680

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto" // Réinitialiser pour recalculer
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <MagicCard className="relative">
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          className="min-h-[7.5vh] w-full resize-none overflow-hidden border-0 pt-4 text-xl shadow-none focus-visible:ring-0"
          placeholder="Describe the sound you want..."
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {charCount.toLocaleString()} / {maxChars.toLocaleString()}
          </div>
          <Button className="text-md h-9">Generate Vidéo</Button>
        </div>
      </MagicCard>
    </div>
  )
}
