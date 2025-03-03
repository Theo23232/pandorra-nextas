"use client"

import { Check, Copy, CornerLeftUp, Menu, Move, Zap } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { Tooltip } from "@/components/tremor/ui/tooltip"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { models } from "@/lib/leonardo/presets"

import { AIImage } from "./AIImage"
import { GenerationOption } from "./GenerationOption"

import type { GenerationWithImages } from "@/types/pandorra"

export type GenerationResultProps = {
  count?: number
  isLoading?: boolean
  generated?: GenerationWithImages
}

export const GenerationResult = ({
  count = 0,
  isLoading = false,
  generated,
}: GenerationResultProps) => {
  const { t } = useTranslation()
  const model = models.find((m) => m.id === generated?.modelId)
  const [isCopied, setIsCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isCopied])

  const handleCopy = async () => {
    if (generated?.prompt) {
      await navigator.clipboard.writeText(generated.prompt)
      setIsCopied(true)
    }
  }

  const handleReuseGeneration = () => {
    if (generated) {
      const queryParams = new URLSearchParams({
        prompt: generated.prompt || "",
        imageSize: `${generated.imageWidth}×${generated.imageHeight}`,
        modelId: generated.modelId || "",
        presetStyle: generated.presetStyle || "",
      }).toString()
      router.push(`/image/generation?${queryParams}`)
    }
  }

  const renderTooltipButton = (
    content: string,
    icon: React.ReactNode,
    text?: string,
    onClick?: () => void,
  ) => (
    <Tooltip content={content}>
      <div className="flex items-center gap-2 text-sm" onClick={onClick}>
        {icon}
        {text && <span>{text}</span>}
      </div>
    </Tooltip>
  )

  const renderHeader = () => {
    if (!isLoading) {
      return (
        <div className="flex w-full items-center justify-between pb-4 pt-8 max-lg:flex-col max-lg:items-start max-lg:gap-2">
          <div className="flex items-center gap-2">
            {renderTooltipButton(
              t(`Reuse generation option`),
              <Button
                variant="outline"
                size="icon"
                onClick={handleReuseGeneration}
                id="tour6-step4"
              >
                <CornerLeftUp size={20} />
              </Button>,
            )}
            <Tooltip className="max-w-lg" content={generated?.prompt || ""}>
              <p className="truncate-1-lines line-clamp-1 max-w-[300px] text-lg">
                {generated?.prompt}
              </p>
            </Tooltip>
            <Tooltip content={isCopied ? "Copied!" : "Copy prompt"}>
              <Button
                variant="ghost"
                size="sm"
                id="tour6-step5"
                className="flex items-center gap-2 p-2 transition-all duration-200 ease-in-out"
                onClick={handleCopy}
              >
                {isCopied ? (
                  <>
                    <Check size={16} className="text-green-500" />
                    <span className="text-green-500">{t(`Copied`)}</span>
                  </>
                ) : (
                  <Copy size={16} />
                )}
              </Button>
            </Tooltip>
          </div>
          <div className="flex gap-4 max-lg:flex-row-reverse">
            <div className="flex gap-4" id="tour6-step6">
              {renderTooltipButton(
                `${t(`Model`)} : ${model?.name ?? ""}`,
                <div className="Model flex items-center gap-2">
                  {model?.generated_image?.url && (
                    <Image
                      src={model.generated_image.url || "/placeholder.svg"}
                      width={64}
                      height={64}
                      alt={model?.name ?? ""}
                      className="size-8 object-cover"
                    />
                  )}
                </div>,
              )}
              {renderTooltipButton(
                `${t(`Preset style`)} ${t(generated?.presetStyle || "")}`,
                <Zap size={20} />,
              )}
              {renderTooltipButton(
                `${t(`Resolution`)} : ${generated?.imageWidth} × ${generated?.imageHeight}`,
                <Move size={20} className="rotate-45" />,
              )}
            </div>
            <GenerationOption generationId={generated?.id || ""}>
              <Button variant="outline" size="icon" id="tour6-step7">
                <Menu />
              </Button>
            </GenerationOption>
          </div>
        </div>
      )
    }
    return <></>
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid w-full grid-cols-1 gap-4 pt-8 lg:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="group/card relative flex h-96 w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-gray-50 dark:bg-black/50"
            >
              <div className="relative h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)] dark:border-sky-400"></div>
            </div>
          ))}
        </div>
      )
    } else {
      return (
        <div className="grid w-full grid-cols-1 gap-4 pt-8 lg:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: count }, (_, index) => (
                <Skeleton key={index} className="h-96 w-full" />
              ))
            : generated?.generated_images.map((g) => (
                <AIImage
                  key={g.id}
                  image={{
                    ...g,
                    generationId: generated.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  generationId={generated.id}
                  prompt={generated.prompt ?? ""}
                  model={model?.name ?? ""}
                  preset={generated.presetStyle ?? ""}
                />
              ))}
        </div>
      )
    }
  }

  return (
    <MagicCard gradientSize={700} className="group relative cursor-pointer">
      <CardContent>
        {renderHeader()}
        {renderContent()}
      </CardContent>
    </MagicCard>
  )
}
