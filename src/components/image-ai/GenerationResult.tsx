"use client"

import {
  Check,
  Copy,
  CornerLeftUp,
  Images,
  Menu,
  Move,
  Zap,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

  const renderHeader = () => (
    <div className="flex w-full items-center justify-between pb-4 pt-8">
      <div className="flex items-center gap-2">
        {renderTooltipButton(
          "Reuse generation option",
          <Button variant="outline" size="icon" onClick={handleReuseGeneration}>
            <CornerLeftUp size={20} />
          </Button>,
        )}
        <p className="truncate-1-lines line-clamp-1 max-w-[300px] text-lg">
          {generated?.prompt}
        </p>
        <Tooltip content={isCopied ? "Copied!" : "Copy prompt"}>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 p-2 transition-all duration-200 ease-in-out"
            onClick={handleCopy}
          >
            {isCopied ? (
              <>
                <Check size={16} className="text-green-500" />
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <Copy size={16} />
            )}
          </Button>
        </Tooltip>
      </div>
      <div className="flex gap-4">
        {renderTooltipButton(
          "Model",
          <div className="Model flex items-center gap-2">
            {model?.generated_image?.url && (
              <Image
                src={model.generated_image.url || "/placeholder.svg"}
                width={32}
                height={32}
                alt={model?.name ?? ""}
                className="size-4 object-cover"
              />
            )}
            <span>{model?.name ?? ""}</span>
          </div>,
        )}
        {renderTooltipButton(
          "Preset style",
          <Zap size={16} />,
          generated?.presetStyle ?? undefined,
        )}
        {renderTooltipButton(
          "Number of generation",
          <Images size={16} />,
          generated?.generated_images.length.toString(),
        )}
        {renderTooltipButton(
          "Resolution",
          <Move size={16} className="rotate-45" />,
          `${generated?.imageWidth} × ${generated?.imageHeight}`,
        )}
        <GenerationOption generationId={generated?.id || ""}>
          <Button variant="outline" size="icon">
            <Menu />
          </Button>
        </GenerationOption>
      </div>
    </div>
  )

  const renderContent = () => (
    <div className="flex w-full gap-4">
      {isLoading
        ? Array.from({ length: count }, (_, index) => (
            <Skeleton key={index} className="h-96 w-[calc(25%-1rem)]" />
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

  return (
    <MagicCard gradientSize={700} className="group relative cursor-pointer">
      <CardContent>
        {renderHeader()}
        {renderContent()}
      </CardContent>
    </MagicCard>
  )
}
