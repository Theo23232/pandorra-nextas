"use client"

import { WandSparkles } from "lucide-react"
import Image from "next/image"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { Tooltip } from "@/components/tremor/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Model, models } from "@/lib/leonardo/presets"
import { cn } from "@/lib/utils"

export type ModelSelectDialogProps = {
  children: ReactNode
  activeModel: Model
  onChange: (model: Model) => void
}

export const ModelSelectDialog = (props: ModelSelectDialogProps) => {
  const { t } = useTranslation()
  const handleModelChange = (model: Model) => {
    props.onChange(model)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="pb-0 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WandSparkles /> {t(`Models`)}
          </DialogTitle>
          <DialogDescription>
            {t(
              `Choose one of these models to lead your generation to the style you want`,
            )}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="flex w-full cursor-pointer flex-wrap items-center justify-between max-lg:justify-center">
            {models.map((model) => {
              if (model.generated_image) {
                return (
                  <Card
                    className={cn(
                      "m-2 w-[260px] overflow-hidden border border-border max-lg:w-full",
                      props.activeModel.id == model.id
                        ? "ring-4 ring-primary"
                        : "",
                    )}
                    key={model.id}
                    onClick={() => handleModelChange(model)}
                  >
                    <CardContent className="p-0">
                      {model.generated_image && (
                        <Image
                          className="h-[183px] w-[260px] object-cover max-lg:w-full"
                          width={260}
                          height={183}
                          alt={model.description}
                          src={model.generated_image.url}
                        />
                      )}
                      <Tooltip content={t(model.description)}>
                        <div className="p-4">
                          <div className="w-[230px] max-lg:w-full">
                            {t(model.name)}
                          </div>
                          <p className="truncate-2-lines line-clamp-2 w-[230px] text-sm text-muted-foreground max-lg:w-full">
                            {t(model.description)}
                          </p>
                        </div>
                      </Tooltip>
                    </CardContent>
                  </Card>
                )
              }
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
