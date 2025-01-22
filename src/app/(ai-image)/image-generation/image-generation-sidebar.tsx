"use client"

import {
  ChevronDown,
  ChevronsUpDown,
  Command,
  Images,
  SunMedium,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import useSWR from "swr"

import { CollectionDialog } from "@/components/image-ai/CollectionDialog"
import { ImageNumberInput } from "@/components/image-ai/ImageNumberInput"
import { ImageSizeInput } from "@/components/image-ai/ImageSizeInput"
import { ModelSelectDialog } from "@/components/image-ai/ModelSelectDialog"
import { NavSupport } from "@/components/pandorra/sidebar/nav-support"
import { NavUser } from "@/components/sidebar/nav-user"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectCustomTrigger,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSelectImage } from "@/hooks/use-select-image"
import { Model, presetStyles } from "@/lib/leonardo/presets"
import { fetcher } from "@/lib/utils"
import { User } from "@prisma/client"

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
  const { imageUrl, imageId } = useSelectImage()

  const { data: user } = useSWR<User>("/api/user/current", fetcher)
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

  if (user) {
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/explore">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Pandorra.ai</span>
                    <span className="truncate text-xs">{user.plan}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="flex flex-col gap-2 p-2">
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
                    <p className="w-fit rounded-sm bg-card p-1 text-xs text-primary">
                      Model
                    </p>
                    <p>{activeModel.name}</p>
                  </div>
                  <ChevronsUpDown />
                </CardContent>
              </Card>
            </div>
          </ModelSelectDialog>
          <Select value={presetStyle} onValueChange={handlePresetStyleChange}>
            <SelectCustomTrigger>
              <Button
                className="flex h-[56px] w-full items-center justify-between hover:bg-accent/40"
                variant={"outline"}
              >
                <div className="flex items-center">
                  <Zap size={24} />
                  <div className="ml-2 text-start">
                    <p className="text-xs text-muted-foreground">
                      Preset style
                    </p>
                    <p>{presetStyle}</p>
                  </div>
                </div>
                <ChevronDown />
              </Button>
            </SelectCustomTrigger>
            <SelectContent>
              <SelectGroup>
                {presetStyles.map((style) => (
                  <SelectItem value={style.value} key={style.name}>
                    {style.name}
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
          <Card>
            <CardContent className="space-y-4 p-2">
              <ImageNumberInput onChange={handleCountChange} />
              <ImageSizeInput onChange={handleSizeChange} />
            </CardContent>
          </Card>
          <CollectionDialog>
            <Button variant={"default"} className="w-full">
              <Images size={20} className="mr-2" /> Collection
            </Button>
          </CollectionDialog>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={imageUrl}
              width={400}
              height={700}
              className="h-auto w-full rounded shadow"
            />
          )}
          <NavSupport />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    )
  }
}
