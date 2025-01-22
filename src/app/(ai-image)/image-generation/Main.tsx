"use client"
import { ImagePlus } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { getUserGeneration } from "@/actions/generation.action"
import { GenerationResult } from "@/components/image-ai/GenerationResult"
import { Button } from "@/components/tremor/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { fetchGenerationResult } from "@/lib/leonardo/fetch"
import { GeneratedImage, Prisma } from "@prisma/client"

export type MainProps = {
  prompt: string
  id: string | undefined
  count: number
  onGenerate: () => void
  onPromptChange: (prompt: string) => void
}

export type GenerationWithImages = Omit<
  Prisma.GenerationGetPayload<{
    include: { generated_images: true }
  }>,
  "generated_images"
> & {
  generated_images: Array<
    Pick<GeneratedImage, "id" | "url" | "nsfw" | "motionMP4URL">
  >
}

export const Main = (props: MainProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [prompt, setPrompt] = useState(props.prompt)
  const [isLoading, setIsLoading] = useState(false)
  const [generated, setGenerated] = useState<GenerationWithImages>()
  const [history, setHistory] = useState<GenerationWithImages[]>([])

  const handlePromptChange = (p: string) => {
    setPrompt(p)
    props.onPromptChange(p)
  }
  const generate = () => {
    setIsLoading(true)
    props.onGenerate()
  }
  useEffect(() => {
    if (props.id) {
      const fetch = async () => {
        setIsLoading(true)
        const result = await fetchGenerationResult(props.id!)
        if (result.generated_images.length) {
          setIsLoading(false)
          setGenerated(result)
          setHistory([...history, result])
        }
      }
      fetch().then(() => {})
    }
  }, [props.id])

  useEffect(() => {
    const req = async () => {
      const res = await getUserGeneration()
      setHistory(res)
    }
    req().then(() => {})
  }, [])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])
  return (
    <div className="flex flex-col justify-center px-4">
      <div className="relative mb-4 w-full">
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Type a prompt ..."
          className="no-scroll w-full appearance-none bg-background/70 pr-44 align-middle backdrop-blur"
          style={{
            height: "48px",
            verticalAlign: "middle",
            paddingTop: "20px",
          }}
        />
        <div className="absolute bottom-2 right-0 flex items-center space-x-1 pr-2">
          <Button variant="outline" className="shrink-0">
            <ImagePlus />
          </Button>
          <Button onClick={generate} isLoading={isLoading}>
            Generate
          </Button>
        </div>
      </div>
      {generated && isLoading && (
        <GenerationResult
          isLoading={isLoading}
          count={props.count}
          generated={generated}
        />
      )}
      <div className="flex w-full flex-col-reverse gap-4">
        {history
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          )
          .map((h) => (
            <GenerationResult generated={h} key={h.id} />
          ))}
      </div>
    </div>
  )
}
