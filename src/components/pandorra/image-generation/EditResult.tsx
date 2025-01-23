"use client"

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export const EditResut = ({
  originalUrl,
  variantUrl,
}: {
  originalUrl: string
  variantUrl: string
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Image
            src={originalUrl}
            width={640}
            height={480}
            objectFit="cover"
            alt={originalUrl}
            className="h-full max-h-[70vh] w-auto rounded shadow"
          />
        </button>
      </DialogTrigger>
      <DialogContent>
        <Card className="mb-4 bg-background/70 backdrop-blur">
          <CardContent className="flex items-center justify-center gap-4 p-4">
            <Image
              src={originalUrl}
              width={640}
              height={480}
              objectFit="cover"
              alt={originalUrl}
              className="h-full max-h-[70vh] w-auto rounded shadow"
            />
            <ArrowRight />
            <div className="h-fit w-fit bg-muted/80">
              <Image
                src={variantUrl}
                width={640}
                height={480}
                objectFit="cover"
                alt={variantUrl}
                className="h-full max-h-[70vh] w-auto rounded shadow"
              />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
