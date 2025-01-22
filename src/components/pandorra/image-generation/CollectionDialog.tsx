'use client';

import { Import, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, ReactNode, useState } from 'react';
import useSWR, { mutate } from 'swr';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelectImage } from '@/hooks/use-select-image';
import { saveImage, uploadImage } from '@/lib/leonardo/fetch';
import { fetcher } from '@/lib/utils';
import { UserImage } from '@prisma/client';

export type CollectionProps = {
  children: ReactNode;
};

export const CollectionDialog = (props: CollectionProps) => {
  const { data: collection } = useSWR<UserImage[]>('/api/user/collection', fetcher);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { selectImage, selectImageId } = useSelectImage();

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = event.target.files?.[0];
    if (!file) return;

    // Convertir le fichier en base64
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const base64Image = await toBase64(file);
    const fileName = file.name;

    // Appeler la Server Action pour enregistrer l'image
    const result = await saveImage(base64Image, fileName);
    await uploadImage(result);
    console.log(result);
    mutate('/api/user/collection');
    setIsLoading(false);
  };

  const handleClick = (id: string, url: string) => {
    selectImage(url);
    selectImageId(id);
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className='pb-0 sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Your collection</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you&#39;re done.</DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[80vh] pr-4'>
          <Tabs defaultValue='generated' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='imported'>Imported images</TabsTrigger>
              <TabsTrigger value='generated'>Generated images</TabsTrigger>
            </TabsList>
            <TabsContent value='imported'>
              <div className='flex flex-col gap-4'>
                <input type='file' onChange={handleFileUpload} id='inputImage' className='hidden' />
                <Button isLoading={isLoading} onClick={() => (document.getElementById('inputImage') as HTMLInputElement).click()} className='flex w-fit px-4 py-0'>
                  {!isLoading && <Import size={20} className='mr-2' />} Import
                </Button>
                <div className='flex w-full cursor-pointer flex-wrap items-center'>
                  {collection
                    ?.filter((image) => !image.isAIGenerated)
                    .map((image) => (
                      <div className='m-2 w-[260px] overflow-hidden rounded bg-muted shadow' key={image.id} onClick={() => handleClick(image.imageId, image.imageUrl)}>
                        <Image width={400} height={400} alt={image.imageUrl} src={image.imageUrl} className='aspect-square w-full object-cover' />
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value='generated'>
              <div className='flex flex-col gap-4'>
                <Button isLoading={isLoading} onClick={() => (document.getElementById('inputImage') as HTMLInputElement).click()} className='flex w-fit px-4 py-0'>
                  {!isLoading && <Sparkles size={20} className='mr-2' />}Generate
                </Button>
                <div className='flex w-full cursor-pointer flex-wrap items-center justify-between'>
                  {collection
                    ?.filter((image) => image.isAIGenerated)
                    .map((image) => (
                      <div className='m-2 w-[260px] overflow-hidden rounded bg-muted shadow' key={image.id} onClick={() => handleClick(image.imageId, image.imageUrl)}>
                        <Image width={400} height={400} alt={image.imageUrl} src={image.imageUrl} className='aspect-square w-full object-cover' />
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
