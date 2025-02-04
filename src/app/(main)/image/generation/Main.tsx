"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { getUserGeneration } from "@/actions/generation.action"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { GenerationResult } from "@/components/image-ai/GenerationResult"
import { NothingYet } from "@/components/NothingYet"
import { Skeleton } from "@/components/nyxb/skeleton"
import { Button } from "@/components/tremor/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { fetchGenerationResult, generationInsert } from "@/lib/leonardo/fetch"
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
  const searchParams = useSearchParams()
  const queryPrompt = searchParams.get("prompt")

  const [prompt, setPrompt] = useState(props.prompt)
  const [isLoading, setIsLoading] = useState(false)
  const [generated, setGenerated] = useState<GenerationWithImages>()
  const [history, setHistory] = useState<GenerationWithImages[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (queryPrompt) {
      setPrompt(queryPrompt)
      props.onPromptChange(queryPrompt)
    }
  }, [queryPrompt])

  const handlePromptChange = (p: string) => {
    setPrompt(p)
    props.onPromptChange(p)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto" // Réinitialiser pour recalculer
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }
  const generate = () => {
    setIsLoading(true)
    props.onGenerate()
  }
  useEffect(() => {
    if (props.id) {
      const fetch = async () => {
        new Promise((resolve, reject) => {
          const interval = setInterval(async () => {
            try {
              setIsLoading(true)
              const result = await fetchGenerationResult(props.id!)
              if (result && result.generations_by_pk.generated_images.length) {
                const generation = await generationInsert(result)
                setHistory((prev) => [...prev, generation])
                setIsLoading(false)

                clearInterval(interval) // Nettoyer l'intervalle ici
                resolve(result)
                // window.location.reload()
              }
            } catch (error) {
              clearInterval(interval)
              console.log(error)
              reject(error)
            }
          }, 2000)
        })
      }
      fetch().then(() => {})
    }
  }, [props.id, generated])

  useEffect(() => {
    const req = async () => {
      const res = await getUserGeneration()
      setHistory(res)
      setIsLoaded(true)
    }
    req().then(() => {})
  }, [])

  return (
    <div className="flex flex-col justify-center">
      <MagicCard className="mb-4 w-full">
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Type a prompt ..."
          className="w-full resize-none overflow-hidden border-0 pt-4 text-xl shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-end gap-2 p-4">
          <Button
            onClick={generate}
            isLoading={isLoading}
            className="text-md h-9"
          >
            Generate
          </Button>
        </div>
      </MagicCard>

      {history.length == 0 && isLoaded == true && isLoading == false && (
        <NothingYet
          subtitle="Your image generation will be displayed here"
          title="There is no image yet"
        />
      )}
      <div className="flex w-full flex-col-reverse gap-4">
        {history.map((h) => (
          <GenerationResult generated={h} key={h.id} />
        ))}
        {isLoading && <GenerationSkeleton />}
      </div>
      {!isLoaded && (
        <>
          <div className="flex w-full flex-col-reverse gap-4">
            <GenerationSkeleton />
            <GenerationSkeleton />
            <GenerationSkeleton />
          </div>
        </>
      )}
    </div>
  )
}

const GenerationSkeleton = () => {
  return (
    <MagicCard gradientSize={700} className="group relative cursor-pointer">
      <Skeleton className="h-[450px] w-full" />
    </MagicCard>
  )
}
