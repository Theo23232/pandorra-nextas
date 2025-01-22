"use client"
import { useState } from "react"

import { ImageGenerationSidebar } from "@/app/(ai-image)/image-generation/image-generation-sidebar"
import JetonCounter from "@/components/pandorra/jeton-counter"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSelectImage } from "@/hooks/use-select-image"
import { leofetch } from "@/lib/leonardo/fetch"
import { Model, models } from "@/lib/leonardo/presets"

import { Main } from "./Main"

export default function RoutePage() {
  //en fait c'est un ID
  const { imageUrl, imageId } = useSelectImage()

  type State = {
    prompt: string
    activeModel: Model
    presetStyle: string
    contrast: string
    count: number
    id: string | undefined
    height: number
    width: number
  }
  const [state, setState] = useState<State>({
    prompt: "",
    activeModel: models[0],
    presetStyle: "DYNAMIC",
    contrast: "Medium",
    count: 2,
    id: undefined,
    height: 1176,
    width: 784,
  })

  const { prompt, activeModel, presetStyle, contrast, count, width, height } =
    state

  const generate = async () => {
    console.log(state)
    const contrast = state.contrast
    const data = {
      alchemy: true,
      height: state.height,
      width: state.width,
      modelId: state.activeModel.id,
      contrastRatio: contrast == "Medium" ? 0.5 : contrast == "Low" ? 0 : 1,
      num_images: state.count,
      prompt: state.prompt,
      presetStyle: state.presetStyle,
      imagePrompts: imageUrl ? [imageUrl] : [],
    }
    await leofetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
      method: "POST",
      data,
    }).then((initGen: any) => {
      if (
        initGen &&
        initGen.sdGenerationJob &&
        initGen.sdGenerationJob.generationId
      ) {
        handleStateChange("id", initGen.sdGenerationJob.generationId)
      }
    })
  }

  const handleStateChange = (key: keyof typeof state, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  return (
    <SidebarProvider>
      <ImageGenerationSidebar
        onModelChange={(model) => handleStateChange("activeModel", model)}
        onPresetStyleChange={(value) => handleStateChange("presetStyle", value)}
        onContrastChange={(value) => handleStateChange("contrast", value)}
        onCountChange={(value) => handleStateChange("count", value)}
        onSizeChange={(width, height) => {
          handleStateChange("width", width)
          handleStateChange("height", height)
        }}
        defaultmodel={activeModel}
        defaultwidth={width}
        defaultheight={height}
        defaultpresetstyle={presetStyle}
        defaultcontrast={contrast}
        defaultcount={count}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex w-full items-center justify-between gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex gap-4">
              <JetonCounter />
            </div>
          </div>
        </header>
        <Main
          onGenerate={generate}
          onPromptChange={(prompt) => handleStateChange("prompt", prompt)}
          prompt={prompt}
          count={state.count}
          id={state.id}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
