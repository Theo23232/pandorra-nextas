'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ratioList } from '@/lib/ratioList';
import { cn } from '@/lib/utils';

export type ImageSizeProps = {
  onChange: (width: number, height: number) => void;
};

export const ImageSizeInput = (props: ImageSizeProps) => {
  const [activeName, setActiveName] = useState('2:3');
  const [activeSize, setActiveSize] = useState<'small' | 'medium' | 'large'>('medium');

  const handleChangeRatio = (ratioName: string) => {
    setActiveName(ratioName);
    props.onChange(ratioList.find((ratio) => ratio.ratio === ratioName)?.[activeSize].w || 0, ratioList.find((ratio) => ratio.ratio === ratioName)?.[activeSize].h || 0);
  };
  const handleChangeSize = (size: 'small' | 'medium' | 'large') => {
    setActiveSize(size);
    props.onChange(ratioList.find((ratio) => ratio.ratio === activeName)?.[size].w || 0, ratioList.find((ratio) => ratio.ratio === activeName)?.[size].h || 0);
  };
  return (
    <div className='space-y-2'>
      <Label className='mb-2'>Image dimensions</Label>
      <div className='fex w-full gap-2'>
        <Button variant={'outline'} className={cn('h-8 w-1/6 hover:bg-zinc-400 dark:hover:bg-zinc-900', activeName == '2:3' ? ' primeBg' : '')} onClick={() => handleChangeRatio('2:3')}>
          2:3
        </Button>
        <Button variant={'outline'} className={cn('h-8 w-1/6 hover:bg-zinc-400 dark:hover:bg-zinc-900', activeName == '16:9' ? 'primeBg' : '')} onClick={() => handleChangeRatio('16:9')}>
          16:9
        </Button>
        <Button variant={'outline'} className={cn('h-8 w-1/6 hover:bg-zinc-400 dark:hover:bg-zinc-900', activeName == '1:1' ? 'primeBg' : '')} onClick={() => handleChangeRatio('1:1')}>
          1:1
        </Button>
        <Button variant={'outline'} className={cn('h-8 w-1/6 hover:bg-zinc-400 dark:hover:bg-zinc-900', activeName == '4:5' ? 'primeBg' : '')} onClick={() => handleChangeRatio('4:5')}>
          4:5
        </Button>
        <Button variant={'outline'} className={cn('h-8 w-1/6 hover:bg-zinc-400 dark:hover:bg-zinc-900', activeName == '9:16' ? 'primeBg' : '')} onClick={() => handleChangeRatio('9:16')}>
          9:16
        </Button>
        <Button variant={'outline'} className={cn('h-8 w-1/6 hover:bg-zinc-400 dark:hover:bg-zinc-900', activeName == '2:1' ? 'primeBg' : '')} onClick={() => handleChangeRatio('2:1')}>
          2:1
        </Button>
      </div>
      <div className='flex w-full justify-between'>
        <Button
          size={'sm'}
          variant={'outline'}
          className={cn(' w-1/3 hover:bg-zinc-400 dark:hover:bg-zinc-900 flex flex-col justify-center items-center', activeSize == 'small' ? 'primeBg' : '')}
          onClick={() => handleChangeSize('small')}
        >
          <p className='text-sm'>Small</p>
          <p className='text-[8px]'>
            {ratioList.find((ratio) => ratio.ratio === activeName)?.small.h || 'Unknown'} × {ratioList.find((ratio) => ratio.ratio === activeName)?.small.w || 'Unknown'}
          </p>
        </Button>
        <Button
          size={'sm'}
          variant={'outline'}
          className={cn(' w-1/3 hover:bg-zinc-400 dark:hover:bg-zinc-900 flex flex-col justify-center items-center', activeSize == 'medium' ? 'primeBg' : '')}
          onClick={() => handleChangeSize('medium')}
        >
          <p className='text-sm'>Medium</p>
          <p className='text-[8px]'>
            {ratioList.find((ratio) => ratio.ratio === activeName)?.medium.h || 'Unknown'} × {ratioList.find((ratio) => ratio.ratio === activeName)?.medium.w || 'Unknown'}
          </p>
        </Button>
        <Button
          size={'sm'}
          variant={'outline'}
          className={cn(' w-1/3 hover:bg-zinc-400 dark:hover:bg-zinc-900 flex flex-col justify-center items-center', activeSize == 'large' ? 'primeBg' : '')}
          onClick={() => handleChangeSize('large')}
        >
          <p className='text-sm'>Large</p>
          <p className='text-[8px]'>
            {ratioList.find((ratio) => ratio.ratio === activeName)?.large.h || 'Unknown'} × {ratioList.find((ratio) => ratio.ratio === activeName)?.large.w || 'Unknown'}
          </p>
        </Button>
      </div>
    </div>
  );
};
