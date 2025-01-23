"use client"

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import useSWR from 'swr';

import { GenerationResult } from '@/components/pandorra/image-generation/GenerationResult';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { fetcher } from '@/lib/utils';
import { GenerationWithImages } from '@/types/pandorra';
import { Prisma } from '@prisma/client';
import { DialogTrigger } from '@radix-ui/react-dialog';

type VariantWithRelations = Prisma.VariantGetPayload<{
  include: {
    original: true
    variant: true
  }
}>

interface WatchOriginalProps {
  imageId: string
  isVariant: boolean
  children: React.ReactNode
}

export const WatchOriginal: React.FC<WatchOriginalProps> = ({
  imageId,
  isVariant,
  children,
}) => {
  const { data } = useSWR<GenerationWithImages | VariantWithRelations>(
    `/api/image/source/${isVariant}/${imageId}`,
    fetcher,
  )

  function isVariantWithRelations(
    data: GenerationWithImages | VariantWithRelations,
  ): data is VariantWithRelations {
    return isVariant
  }

  if (data) {
    if (isVariantWithRelations(data)) {
      return (
        <Dialog>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="flex w-fit items-center justify-center border-transparent bg-none">
            <Image
              className="max-h-[70vh] rounded bg-muted"
              width={800}
              height={1200}
              alt={data.original.imageUrl}
              src={data.original.imageUrl}
            />
            <Button className="h-12 w-12">
              <ArrowRight className="size-8" />
            </Button>
            <Image
              className="max-h-[70vh] rounded bg-muted"
              width={800}
              height={1200}
              alt={data.variant.imageUrl}
              src={data.variant.imageUrl}
            />
          </DialogContent>
        </Dialog>
      )
    } else {
      return (
        <Dialog>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="max-w-[1024px]">
            <GenerationResult generated={data} />
          </DialogContent>
        </Dialog>
      )
    }
  }

  return <>{children}</>
}
