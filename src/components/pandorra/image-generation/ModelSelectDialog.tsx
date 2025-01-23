"use client"

import { WandSparkles } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Model, models } from '@/lib/leonardo/presets';
import { cn } from '@/lib/utils';

export type ModelSelectDialogProps = {
  children: ReactNode
  activeModel: Model
  onChange: (model: Model) => void
}

export const ModelSelectDialog = (props: ModelSelectDialogProps) => {
  const handleModelChange = (model: Model) => {
    props.onChange(model)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="pb-0 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WandSparkles /> Models
          </DialogTitle>
          <DialogDescription>
            Choose one of these models to lead your generation to the style you
            want
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <Tabs defaultValue="best" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="best">Bests models</TabsTrigger>
              <TabsTrigger value="Others">Others</TabsTrigger>
            </TabsList>
            <TabsContent value="best">
              <div className="flex w-full cursor-pointer flex-wrap items-center justify-between">
                {models.map((model) => {
                  if (model.generated_image) {
                    return (
                      <Card
                        className={cn(
                          "m-2 w-[260px] overflow-hidden",
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
                              className="h-[183px] w-[260px] object-cover"
                              width={260}
                              height={183}
                              alt={model.description}
                              src={model.generated_image.url}
                            />
                          )}
                          <div className="p-4">
                            <div className="w-[230px]">{model.name}</div>
                            <p className="truncate-2-lines line-clamp-2 w-[230px] text-sm text-muted-foreground">
                              {model.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }
                })}
              </div>
            </TabsContent>
            <TabsContent value="Others">
              <div className="flex w-full cursor-pointer flex-wrap items-center justify-between">
                {models.map((model) => {
                  if (model.generated_image == null) {
                    return (
                      <Card
                        className={cn(
                          "m-2 w-[260px] overflow-hidden",
                          props.activeModel.id == model.id
                            ? "ring-4 ring-primary"
                            : "",
                        )}
                        key={model.id}
                        onClick={() => handleModelChange(model)}
                      >
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="w-[230px]">{model.name}</div>
                            <p className="truncate-2-lines line-clamp-2 w-[230px] text-sm text-muted-foreground">
                              {model.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }
                })}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
