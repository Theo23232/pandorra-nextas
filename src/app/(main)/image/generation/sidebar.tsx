"use client"
import { ChevronDown, ChevronsUpDown, SunMedium, Zap } from "lucide-react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useOnborda } from "onborda"
import * as React from "react"

import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { ImageNumberInput } from "@/components/image-ai/ImageNumberInput"
import { ImageSizeInput } from "@/components/image-ai/ImageSizeInput"
import { ModelSelectDialog } from "@/components/image-ai/ModelSelectDialog"
import { Button } from "@/components/tremor/ui/button"
import { Card, CardContent } from "@/components/tremor/ui/card"
import {
  Select,
  SelectContent,
  SelectCustomTrigger,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"
import { useUser } from "@/hooks/use-user"
import {
  findModelById,
  Model,
  models,
  presetStyles,
} from "@/lib/leonardo/presets"

export type SidebarProps = {
  onModelChange: (model: Model) => void
  onPresetStyleChange: (value: string) => void
  onContrastChange: (value: string) => void
  onCountChange: (value: number) => void
  onSizeChange: (w: number, h: number) => void
  defaultmodel: Model
  defaultpresetstyle: string
  defaultcontrast: string
  defaultcount: number
  defaultwidth: number
  defaultheight: number
}

export function ImageGenerationSidebar(props: SidebarProps) {
  const searchParams = useSearchParams()
  const queryPresetStyle = searchParams?.get("presetStyle")
  const queryModelId = searchParams?.get("modelId")
  const { startOnborda } = useOnborda()
  const { user } = useUser()

  const [activeModel, setActiveModel] = React.useState<Model>(
    props.defaultmodel,
  )

  const [presetStyle, setPresetStyle] = React.useState(props.defaultpresetstyle)
  const [contrast, setContrast] = React.useState(props.defaultcontrast)
  const [size, setSize] = React.useState({
    width: props.defaultwidth,
    height: props.defaultheight,
  })
  const [count, setCount] = React.useState(props.defaultcount)

  React.useEffect(() => {
    if (queryPresetStyle) {
      setPresetStyle(queryPresetStyle)
    }
    if (queryModelId) {
      const queryModel = findModelById(queryModelId)
      setActiveModel(queryModel ?? models[0])
    }
  }, [queryPresetStyle, queryModelId])

  React.useEffect(() => {
    props.onModelChange(activeModel)
    props.onPresetStyleChange(presetStyle)
    props.onContrastChange(contrast)
    props.onCountChange(count)
    props.onSizeChange(size.width, size.height)
  }, [activeModel, presetStyle, contrast, count, size.width, size.height])

  const handleModelChange = (model: Model) => {
    setActiveModel(model)
  }
  const handlePresetStyleChange = (value: string) => {
    setPresetStyle(value)
  }
  const handleContrastChange = (value: string) => {
    setContrast(value)
  }
  const handleSizeChange = (width: number, height: number) => {
    setSize({ width, height })
  }

  const handleCountChange = (value: number) => {
    setCount(value)
  }
  React.useEffect(() => {
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
    <MagicCard className="sticky top-20 h-fit max-h-[90vh] w-96 overflow-y-auto border-l bg-card p-4">
      <aside className="flex grow flex-col gap-y-6 overflow-y-auto">
        <div id="tour5-step1">
          <ModelSelectDialog
            activeModel={activeModel}
            onChange={handleModelChange}
          >
            <div className="relative flex h-20 w-full cursor-pointer items-center justify-center overflow-hidden px-4 py-2">
              {activeModel.generated_image && (
                <Image
                  className="absolute top-0 z-10 w-full"
                  src={activeModel.generated_image?.url}
                  alt={activeModel.description}
                  width={280}
                  height={280}
                />
              )}
              <Card className="z-20 h-full w-full rounded-sm bg-card/90 p-0">
                <CardContent className="flex h-full items-center justify-between p-0 px-4">
                  <div className="flex flex-col justify-center">
                    <p>{activeModel.name}</p>
                  </div>
                  <ChevronsUpDown />
                </CardContent>
              </Card>
            </div>
          </ModelSelectDialog>
        </div>
        <Select value={presetStyle} onValueChange={handlePresetStyleChange}>
          <SelectCustomTrigger>
            <Button
              className="flex h-[56px] w-full items-center justify-between hover:bg-accent/40"
              variant={"outline"}
              id="tour5-step2"
            >
              <div className="flex items-center">
                <Zap size={24} />
                <div className="ml-2 text-start">
                  <p className="text-xs text-muted-foreground">Preset style</p>
                  <p>PA</p>
                </div>
              </div>
              <ChevronDown />
            </Button>
          </SelectCustomTrigger>
          <SelectContent>
            <SelectGroup>
              {presetStyles.map((style) => (
                <SelectItem value={style.value} key={style.name}>
                  {style.name.replace(/_/g, " ").charAt(0).toUpperCase() +
                    style.name.slice(1).toLowerCase().replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={contrast} onValueChange={handleContrastChange}>
          <SelectCustomTrigger>
            <Button
              className="flex h-[56px] w-full items-center justify-between hover:bg-accent/40"
              variant={"outline"}
              id="tour5-step3"
            >
              <div className="flex items-center">
                <SunMedium size={24} />
                <div className="ml-2 text-start">
                  <p className="text-xs text-muted-foreground">Contrast</p>
                  <p>{contrast}</p>
                </div>
              </div>
              <ChevronDown />
            </Button>
          </SelectCustomTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hight">Hight</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <ImageNumberInput onChange={handleCountChange} />
        <ImageSizeInput onChange={handleSizeChange} />
      </aside>
    </MagicCard>
  )
}
