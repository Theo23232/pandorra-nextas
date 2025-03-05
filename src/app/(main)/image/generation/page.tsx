"use client"
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useOnborda } from 'onborda';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';

import { reduceCredit } from '@/actions/credits.actions';
import { ImageGenerationDialog } from '@/app/(main)/image/generation/ImageGenerationDialog';
import { ImageGenerationSidebar } from '@/app/(main)/image/generation/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useImageLoading } from '@/hooks/use-image-loading';
import { useSelectImage } from '@/hooks/use-select-image';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { leonardoGenerateImage } from '@/lib/leonardo/fetch';
import { Model, models } from '@/lib/leonardo/presets';

import { Main } from './Main';

export default function RoutePage() {
  const { t } = useTranslation()
  const { imageUrl } = useSelectImage()
  const { imageLoading, setImageNumber } = useImageLoading()

  const { user } = useUser()
  const { startOnborda } = useOnborda()
  const [dialogOpen, setDialogOpen] = useState<Boolean>(false)

  const { toast } = useToast()

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
    activeModel: localStorage.getItem("activeModel")
      ? (JSON.parse(localStorage.getItem("activeModel") ?? "") as Model)
      : models[0],
    presetStyle: localStorage.getItem("presetStyle")
      ? JSON.parse(localStorage.getItem("presetStyle") ?? "")
      : "DYNAMIC",
    contrast: localStorage.getItem("contrast")
      ? JSON.parse(localStorage.getItem("contrast") ?? "")
      : "Medium",
    count: localStorage.getItem("count")
      ? parseInt(JSON.parse(localStorage.getItem("count") ?? ""))
      : 2,
    id: undefined,
    height: localStorage.getItem("height")
      ? parseInt(JSON.parse(localStorage.getItem("height") ?? ""))
      : 1176,
    width: localStorage.getItem("width")
      ? parseInt(JSON.parse(localStorage.getItem("width") ?? ""))
      : 784,
  })

  const { prompt, activeModel, presetStyle, contrast, count, width, height } =
    state
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const closeDialog = () => {
    setIsDialogOpen(false)
    setDialogOpen(false)
  }

  const openDialog = () => {
    setIsDialogOpen(true)
    setDialogOpen(true)
  }

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
    setImageNumber(state.count)

    await reduceCredit(state.count * 5)
    mutate("/api/auth/session")
    await leonardoGenerateImage({
      method: "POST",
      data,
    })
      .then((initGen: any) => {
        if (initGen.error) {
          handleStateChange("id", "error")
          toast({
            title: "Generation error",
            description: initGen.error,
            variant: "error",
            duration: 3000,
          })
        }
      })
      .catch(() => {
        setImageNumber(0)

        toast({
          title: "Generation error",
          description: "",
          variant: "error",
          duration: 3000,
        })
      })
    setImageNumber(0)
  }

  const handleStateChange = (key: keyof typeof state, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
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
          handleStateChange("activeModel", model)
        }}
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
      <div className="hidden lg:block">
        <ImageGenerationSidebar
          onModelChange={(model) => handleStateChange("activeModel", model)}
          onPresetStyleChange={(value) =>
            handleStateChange("presetStyle", value)
          }
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
      </div>

      <ScrollArea className="w-full p-6 pt-0">
        <Main
          onGenerate={generate}
          onPromptChange={(prompt) => handleStateChange("prompt", prompt)}
          prompt={prompt}
          count={state.count}
          id={state.id}
        />
      </ScrollArea>
    </div>
  )
}
