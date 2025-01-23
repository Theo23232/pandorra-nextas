"use client"
import { Copy, CornerLeftUp, Images, Menu, Move, Zap } from 'lucide-react';
import Image from 'next/image';

import { MagicCard } from '@/components/animated/magic-ui/magic-card';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { models } from '@/lib/leonardo/presets';
import { GenerationWithImages } from '@/types/pandorra';

import { AIImage } from './AIImage';
import { GenerationOption } from './GenerationOption';

export type GenerationResultProps = {
  count?: number
  isLoading?: boolean
  generated?: GenerationWithImages
}

export const GenerationResult = (props: GenerationResultProps) => {
  const model = models.find((m) => m.id == props.generated?.modelId)
  return (
    <MagicCard gradientSize={700} className="group relative cursor-pointer">
      <CardContent>
        <div className="flex w-full items-center justify-between pb-4 pt-8">
          <div className="flex items-center gap-2">
            <Button variant={"outline"} size={"icon"}>
              <CornerLeftUp size={20} />
            </Button>
            <p className="truncate-1-lines line-clamp-1 max-w-[300px] text-lg">
              {props.generated?.prompt}
            </p>
            <div className="cursor-pointer rounded-sm p-2 hover:bg-background">
              <Copy size={16} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm">
              {model?.generated_image?.url && (
                <Image
                  src={model?.generated_image?.url || ""}
                  width={32}
                  height={32}
                  alt={model?.name ?? ""}
                  className="size-4 object-cover"
                />
              )}{" "}
              {model?.name ?? ""}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap size={16} />
              {props.generated?.presetStyle}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Images size={16} />
              {props.generated?.generated_images.length}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Move size={16} className="rotate-45" />
              <p className="text-sm">{`${props.generated?.imageWidth} × ${props.generated?.imageHeight} `}</p>
            </div>
            <GenerationOption generationId={props.generated?.id || ""}>
              <Button variant={"outline"} size={"icon"} className="">
                <Menu />
              </Button>
            </GenerationOption>
          </div>
        </div>
        <div className="flex w-full gap-4">
          {props.isLoading &&
            Array.from({ length: props.count ?? 0 }, (_, index) => (
              <Skeleton key={index} className="h-96 w-[calc(25%-1rem)]" />
            ))}
          {props.generated &&
            !props.isLoading &&
            props.generated.generated_images.map((g) => (
              <AIImage
                key={g.id}
                image={{
                  ...g,
                  generationId: props.generated!.id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }}
                generationId={props.generated!.id}
                prompt={props.generated?.prompt ?? ""}
                model={model?.name ?? ""}
                preset={props.generated?.presetStyle ?? ""}
              />
            ))}
        </div>
      </CardContent>
    </MagicCard>
  )
}
