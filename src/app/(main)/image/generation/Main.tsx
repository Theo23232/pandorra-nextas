"use client"
import { Loader2, Sparkles } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useInView } from "react-intersection-observer"
import useSWRInfinite from "swr/infinite"

import { enhanceImagePrompt } from "@/actions/openai.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { GenerationResult } from "@/components/image-ai/GenerationResult"
import { NothingYet } from "@/components/NothingYet"
import { Skeleton } from "@/components/nyxb/skeleton"
import { Button } from "@/components/tremor/ui/button"
import { Tooltip } from "@/components/tremor/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { useImageLoading } from "@/hooks/use-image-loading"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { fetcher } from "@/lib/utils"
import { GeneratedImage, Prisma } from "@prisma/client"

const PAGE_SIZE = 8 // Nombre d'éléments par page

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
  const { imageLoading, setImageNumber } = useImageLoading()
  const { user, mutate: mutateUser } = useUser()
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const searchParams = useSearchParams()
  const queryPrompt = searchParams?.get("prompt")

  // Ref pour l'intersection observer
  const { ref: loadMoreRef, inView } = useInView()

  const [isEnhancing, setIsEnhancing] = useState(false)
  const [prompt, setPrompt] = useState(props.prompt)
  const [history, setHistory] = useState<GenerationWithImages[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { toast } = useToast()

  // Configuration de SWR Infinite pour la pagination
  const getKey = (
    pageIndex: number,
    previousPageData: GenerationWithImages[] | null,
  ) => {
    // Si les données précédentes sont vides, nous avons atteint la fin
    if (previousPageData && !previousPageData.length) return null

    // Première page, pas de données précédentes
    return `/api/generation?page=${pageIndex}&limit=${PAGE_SIZE}`
  }

  const { data, error, size, setSize, mutate, isValidating } = useSWRInfinite<
    GenerationWithImages[]
  >(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateFirstPage: false,
  })

  // Combiner toutes les pages de données
  const allGenerations = data ? data.flat() : []
  const isLoadingMore =
    isValidating || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)

  // Charger plus de données quand l'utilisateur atteint le bas de la page
  useEffect(() => {
    if (inView && !isReachingEnd && !isLoadingMore && !imageLoading) {
      setSize(size + 1)
    }
  }, [inView, isReachingEnd, isLoadingMore, imageLoading])

  useEffect(() => {
    if (data) {
      setHistory(allGenerations)
      setIsLoaded(true)
    }
  }, [data, imageLoading])

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  const generate = async () => {
    if (user) {
      if (user.jeton < props.count * 4) {
        toast({
          title: t(`Error`),
          description: t(`You do not have enought token for this generation`),
          variant: "error",
        })
        return
      }
      props.onGenerate()
    }
  }

  // Rafraîchir toutes les données après une génération
  useEffect(() => {
    mutate()
  }, [imageLoading])

  const enhancePrompt = async () => {
    setIsEnhancing(true)
    try {
      const promptEnhanced = await enhanceImagePrompt(prompt)
      mutateUser()
      handlePromptChange(promptEnhanced)
    } catch (error) {
      toast({
        title: t(`Error`),
        description: t(`Prompt enhancement failed`),
        variant: "error",
        duration: 3000,
      })
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="flex flex-col justify-center">
      <MagicCard className="mb-4 w-full">
        <Textarea
          id="tour6-step1"
          ref={textareaRef}
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder={t(`Type a prompt...`)}
          className="w-full resize-none overflow-hidden border-0 pt-4 text-xl shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-end gap-2 p-4">
          <Tooltip content={t(`Enhance prompt`)}>
            <div
              id="tour6-step2"
              onClick={enhancePrompt}
              className="cursor-pointer rounded p-2 hover:bg-accent hover:text-accent-foreground"
            >
              {isEnhancing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Sparkles size={20} />
              )}
            </div>
          </Tooltip>

          <Button
            onClick={generate}
            isLoading={imageLoading ? true : false}
            className="text-md"
            id="tour6-step3"
          >
            {t(`Generate`)}
            <span className="ml-1 flex items-center justify-center">
              {props.count * 4}{" "}
              <img src="/coin.png" className="ml-0.5 h-5 w-auto" />
            </span>
          </Button>
        </div>
      </MagicCard>

      {history.length == 0 && isLoaded == true && !imageLoading && (
        <NothingYet
          subtitle={t(`Your image generation will be displayed here`)}
          title={t(`There is no image yet`)}
        />
      )}

      <div className="flex w-full flex-col gap-4">
        {history.map((h) => (
          <div key={h.id} className="h-fit w-full">
            <GenerationResult generated={h} key={h.id} />
          </div>
        ))}

        {/* Élément déclencheur pour charger plus d'images */}
        {!isReachingEnd && !isEmpty && history.length > 0 && (
          <div ref={loadMoreRef} className="h-8 w-full">
            {isLoadingMore && !imageLoading && <GenerationSkeleton />}
          </div>
        )}

        {imageLoading ? (
          <GenerationResult
            isLoading={imageLoading ? true : false}
            count={imageLoading}
          />
        ) : (
          <></>
        )}
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
