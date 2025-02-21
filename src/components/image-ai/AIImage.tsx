"use client"

import { Download, Loader, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createPublication } from '@/actions/publication.action';
import ImageSmooth from '@/components/ImageSmooth';
import { Tooltip } from '@/components/tremor/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSelectImage } from '@/hooks/use-select-image';
import { useToast } from '@/hooks/use-toast';
import { GeneratedImage } from '@prisma/client';

import { DirectionAwareHover } from './GeneratedHover';

interface AllImageProps {
  prompt: string
  model: string
  preset: string
  image: GeneratedImage
  generationId?: string
}

export const AIImage = ({
  prompt,
  model,
  preset,
  image,
  generationId,
}: AllImageProps) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const router = useRouter()
  const { selectImage } = useSelectImage()

  const handlePublication = async (
    imageUrl: string,
    prompt: string,
    model: string,
    preset: string,
    generationType: string,
  ) => {
    try {
      const loadingToast = toast({
        title: t(`Loading`),
        description: t(`Your image is being published`),
        variant: "loading",
        disableDismiss: true, // Désactive la fermeture automatique
      })
      await createPublication(imageUrl, prompt, model, preset, generationType)
        .then(() => {
          toast({
            title: t(`Success`),
            description: t(`Your image has been published`),
            variant: "success",
            duration: 3000,
          })
        })
        .catch(() => {
          toast({
            title: t(`An image cannot be published twice`),
            description: t(`You have already posted this image`),
            variant: "error",
          })
        })
        .finally(() => {
          loadingToast.dismiss()
        })

      //et le cacher ici
    } catch (error) {
      console.error("Erreur lors de la publication de l'image :", error)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(image.url)}`
      const response = await fetch(proxyUrl)
      const blob = await response.blob()
      const originalFileName = image.url.split("/").pop() || "image.png"
      const fileName = originalFileName
        .replace("Leonardo", "Pandorra.ai")
        .replace("leonardo", "Pandorra.ai")
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleEdit = (url: string) => {
    selectImage(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div
        onClick={() => setIsOpen(true)}
        className="h-96 w-full"
        id="tour6-step8"
      >
        <DirectionAwareHover imageUrl={image.url}>
          <div className="flex h-full w-full items-center justify-center gap-4">
            <DialogTrigger asChild>
              <Tooltip content={t(`Download`)}>
                <Button
                  size={"icon"}
                  className="size-10 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload()
                  }}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Download />
                  )}
                </Button>
              </Tooltip>
            </DialogTrigger>
            <Tooltip content={t(`Post this image`)}>
              <Button
                size={"icon"}
                className="size-10 rounded-full p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePublication(
                    image.url,
                    prompt,
                    model,
                    preset,
                    "textToImage",
                  )
                }}
              >
                <Send />
              </Button>
            </Tooltip>
            {/* <Tooltip content={t(`Edit`)}>
              <Button
                size={"icon"}
                className="size-10 rounded-full p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit(image.url)
                }}
              >
                <Edit />
              </Button>
            </Tooltip> */}
          </div>
        </DirectionAwareHover>
      </div>
      <DialogContent className="flex max-h-[80vh] max-w-2xl justify-center overflow-hidden border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="hidden">Image</DialogTitle>
        <ImageSmooth
          src={image.url}
          className="max-h-[80vh] w-auto rounded-lg object-contain shadow"
          alt=""
          width="600"
          height="800"
        />
      </DialogContent>
    </Dialog>
  )
}
