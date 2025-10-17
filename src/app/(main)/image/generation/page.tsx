"use client"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useOnborda } from "onborda"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { ImageGenerationDialog } from "@/app/(main)/image/generation/ImageGenerationDialog"
import { ImageGenerationSidebar } from "@/app/(main)/image/generation/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useImageGenerationStore, useImageLoadingStore } from "@/features/image-genaration/store"
import { useGenerateImage } from "@/hooks/image-generation/useGenerateImage"
import { useImageCost, useImageCostUpdater } from "@/hooks/use-image-cost"
import { useSelectImage } from "@/hooks/use-select-image"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"

import { Main } from "./Main"

export default function ImageGenerationPage() {
  const { t } = useTranslation()
  const { imageUrl } = useSelectImage()
  const { imageLoadingCount, setImageNumber } = useImageLoadingStore()

  const { user } = useUser()
  const { startOnborda } = useOnborda()
  const [dialogOpen, setDialogOpen] = useState<Boolean>(false)

  const { toast } = useToast()

  const {
    prompt,
    activeModel,
    presetStyle,
    contrast,
    count,
    width,
    height,
    setPrompt,
    setActiveModel,
    setPresetStyle,
    setContrast,
    setCount,
    setSize,
  } = useImageGenerationStore()

  const { imageCost } = useImageCost()
  useImageCostUpdater()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { generate } = useGenerateImage()

  const closeDialog = () => {
    setIsDialogOpen(false)
    setDialogOpen(false)
  }

  const openDialog = () => {
    setIsDialogOpen(true)
    setDialogOpen(true)
  }

  const handleGenerate = async () => {
    await generate()
  }

  useEffect(() => {
    if (user) {
      const tourOnboarding = user.tourOnboarding
      if (
        !tourOnboarding.includes("fifthtour") &&
        !tourOnboarding.includes("stop")
      ) {
        startOnborda("fifthtour")
      }
    }
  }, [user, startOnborda])

  return (
    <div className="flex pt-4">
      <button
        className="fixed bottom-4 right-4 z-50 block rounded-full bg-blue-500 p-2 text-white lg:hidden"
        onClick={openDialog}
      >
        {!dialogOpen ? (
          <PanelLeftClose size={20} />
        ) : (
          <PanelLeftOpen size={20} />
        )}
      </button>
      <ImageGenerationDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onModelChange={(model) => {
          setActiveModel(model)
        }}
        onPresetStyleChange={(value) => setPresetStyle(value)}
        onContrastChange={(value) => setContrast(value)}
        onCountChange={(value) => setCount(value)}
        onSizeChange={(w, h) => setSize(w, h)}
        defaultmodel={activeModel}
        defaultwidth={width}
        defaultheight={height}
        defaultpresetstyle={presetStyle}
        defaultcontrast={contrast}
        defaultcount={count}
      />
      <div className="hidden lg:block">
        <ImageGenerationSidebar
          onModelChange={(model) => setActiveModel(model)}
          onPresetStyleChange={(value) => setPresetStyle(value)}
          onContrastChange={(value) => setContrast(value)}
          onCountChange={(value) => setCount(value)}
          onSizeChange={(w, h) => setSize(w, h)}
          defaultmodel={activeModel}
          defaultwidth={width}
          defaultheight={height}
          defaultpresetstyle={presetStyle}
          defaultcontrast={contrast}
          defaultcount={count}
        />
      </div>

      <ScrollArea className="w-full p-6 pt-0">
        <Main
          onGenerate={handleGenerate}
          onPromptChange={(p) => setPrompt(p)}
          prompt={prompt}
          count={count}
          id={undefined}
        />
      </ScrollArea>
    </div>
  )
}
