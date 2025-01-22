'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import * as React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export const EditResut = ({originalUrl, variantUrl}:{originalUrl: string, variantUrl: string})=>{
  return <Dialog>
    <DialogTrigger asChild>
      <button>
        <Image src={originalUrl} width={640} height={480} objectFit='cover' alt={originalUrl}
               className='max-h-[70vh] h-full w-auto rounded shadow' />
      </button>
    </DialogTrigger>
    <DialogContent>
      <Card className='mb-4 bg-background/70 backdrop-blur'>
        <CardContent className='p-4 flex items-center justify-center gap-4'>
          <Image src={originalUrl} width={640} height={480} objectFit='cover' alt={originalUrl}
                 className='max-h-[70vh] h-full w-auto rounded shadow' />
          <ArrowRight />
          <div className='w-fit h-fit bg-muted/80'>
            <Image src={variantUrl} width={640} height={480} objectFit='cover' alt={variantUrl}
                   className='max-h-[70vh] h-full w-auto rounded shadow' />
          </div>
        </CardContent>
      </Card>
    </DialogContent>
  </Dialog>







}