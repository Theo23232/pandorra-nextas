"use client"
import { useState } from 'react';

import { Logo } from '@/components/logo';
import { UserProfileMobile } from '@/components/navigation/UserProfile';
import JetonCounter from '@/components/pandorra/jeton-counter';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useSelectImage } from '@/hooks/use-select-image';
import { leofetch } from '@/lib/leonardo/fetch';
import { Model, models } from '@/lib/leonardo/presets';

import { Main } from './Main';
import { ImageGenerationSidebar } from './sidebar';

export default function RoutePage() {
  //en fait c'est un ID
  const { imageUrl } = useSelectImage()

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
    const contrast = state.contrast

    const data = {
      alchemy:
        state.activeModel.id == "b2614463-296c-462a-9586-aafdb8f00e36"
          ? false
          : true,
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
      <div className="w-full lg:pl-96">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white bg-opacity-70 px-2 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-4 dark:border-gray-800 dark:bg-gray-950 dark:bg-opacity-75 dark:backdrop-blur-md">
          <Logo />
          <div className="flex items-center gap-1 sm:gap-2">
            <JetonCounter />

            <UserProfileMobile />
          </div>
        </div>
        <Main
          onGenerate={generate}
          onPromptChange={(prompt) => handleStateChange("prompt", prompt)}
          prompt={prompt}
          count={state.count}
          id={state.id}
        />
      </div>
    </SidebarProvider>
  )
}
