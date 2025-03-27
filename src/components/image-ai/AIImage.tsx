"use client"

import Autoplay from 'embla-carousel-autoplay';
import { Download, Film, Loader, Send, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { deleteImage } from '@/actions/generation.action';
import { createPublication } from '@/actions/publication.action';
import { ImageToVideo } from '@/components/image-ai/ImageToVideo';
import ImageSmooth from '@/components/ImageSmooth';
import { Tooltip } from '@/components/tremor/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
    Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSelectImage } from '@/hooks/use-select-image';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';

import { DirectionAwareHover } from './GeneratedHover';

import type { GeneratedImage } from "@prisma/client"

interface AllImageProps {
  prompt: string
  model: string
  preset: string
  image: GeneratedImage
  generationId?: string
  index: number
  imageList: string[]
}

export const AIImage = ({
  prompt,
  model,
  preset,
  image,
  generationId,
  imageList,
  index,
}: AllImageProps) => {
  const [isImageToVideoOpen, setIsImageToVideoOpen] = useState(false)
  const plugin = useRef(Autoplay({ delay: 9000, stopOnInteraction: true }))
  const { t } = useTranslation()
  const { toast } = useToast()
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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
    if (user?.plan == "Free" || user?.plan == "FreePaid") {
      setIsDownloading(true)
      try {
        // Fetch the original image
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(image.url)}`
        const response = await fetch(proxyUrl)
        const blob = await response.blob()

        // Create an image element for the original image
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = URL.createObjectURL(blob)

        await new Promise((resolve) => {
          img.onload = resolve
        })

        // Create an image element for the watermark
        const watermark = new Image()
        watermark.crossOrigin = "anonymous"
        watermark.src = "/logo/logo-full-white.png"

        await new Promise((resolve) => {
          watermark.onload = resolve
        })

        // Create a canvas to combine the images
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          throw new Error("Could not get canvas context")
        }
        // Draw the original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Calculate watermark size (50% of the image width, maintaining aspect ratio)
        const watermarkWidth = canvas.width * 0.5
        const watermarkHeight =
          (watermark.height / watermark.width) * watermarkWidth

        // Draw the watermark in the bottom left corner with padding
        const padding = 20
        ctx.drawImage(
          watermark,
          canvas.width - watermarkWidth - padding,
          canvas.height - watermarkHeight - padding,
          watermarkWidth,
          watermarkHeight,
        )

        // Convert canvas to blob and download
        const watermarkedBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              throw new Error("Could not create blob from canvas")
            }
          }, "image/png")
        })

        const originalFileName = image.url.split("/").pop() || "image.png"
        const fileName = originalFileName
          .replace("Leonardo", "Pandorra.ai")
          .replace("leonardo", "Pandorra.ai")

        const url = URL.createObjectURL(watermarkedBlob)
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
    } else {
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
  }
  const handleDelete = async (url: string) => {
    setIsDeleting(true)
    try {
      await deleteImage(url)
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (url: string) => {
    selectImage(url)
  }

  return (
    <>
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

              <Tooltip content={t(`Image to video`)}>
                <Button
                  size={"icon"}
                  className="size-10 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsImageToVideoOpen(true)
                  }}
                >
                  <Film />
                </Button>
              </Tooltip>
              <Tooltip content={t(`Delete`)}>
                <Button
                  size={"icon"}
                  variant={"magicDestructive"}
                  className="size-10 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(image.url)
                  }}
                >
                  {isDeleting ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Trash />
                  )}
                </Button>
              </Tooltip>
            </div>
          </DirectionAwareHover>
        </div>
        <DialogContent className="flex max-h-[80vh] max-w-2xl justify-center border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="hidden">Image</DialogTitle>

          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              startIndex: index,
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="flex items-center">
              {imageList.map((image, index) => (
                <CarouselItem key={index}>
                  <ImageSmooth
                    key={image}
                    loading="lazy"
                    alt=""
                    className="max-h-[80vh] w-auto overflow-hidden rounded-lg object-contain shadow"
                    src={image || "/placeholder.svg"}
                    width="600"
                    height="800"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="h-12 w-12 text-lg" />
            <CarouselNext className="h-12 w-12 text-lg" />
          </Carousel>
        </DialogContent>
      </Dialog>
      <Dialog open={isImageToVideoOpen} onOpenChange={setIsImageToVideoOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>{t(`Image to Video`)}</DialogTitle>
          <ImageToVideo imageUrl={image.url} />
        </DialogContent>
      </Dialog>
    </>
  )
}
