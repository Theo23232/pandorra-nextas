"use client"

import { Download, Edit, Send } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { createPublication } from "@/actions/publication.action"
import { Tooltip } from "@/components/tremor/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useSelectImage } from "@/hooks/use-select-image"
import { useToast } from "@/hooks/use-toast"
import { GeneratedImage } from "@prisma/client"

import { DirectionAwareHover } from "./GeneratedHover"

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
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
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
        title: "Loading",
        description: "Your image is being published",
        variant: "loading",
        disableDismiss: true, // Désactive la fermeture automatique
      })
      await createPublication(
        imageUrl,
        prompt,
        model,
        preset,
        generationType,
      ).then(() => {
        loadingToast.dismiss()
        toast({
          title: "Success",
          description: "Your image has been published",
          variant: "success",
          duration: 3000,
        })
      })

      //et le cacher ici
    } catch (error) {
      console.error("Erreur lors de la publication de l'image :", error)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const fileName = image.url.split("/").pop() || "image.png"
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
    }
  }

  const handleEdit = (url: string) => {
    selectImage(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={() => setIsOpen(true)} className="h-96 w-[calc(100%-1rem)]">
        <DirectionAwareHover imageUrl={image.url}>
          <div className="flex h-full w-full items-center justify-center gap-4">
            <DialogTrigger asChild>
              <Tooltip content="Download">
                <Button
                  size={"icon"}
                  className="size-10 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload()
                  }}
                >
                  <Download />
                </Button>
              </Tooltip>
            </DialogTrigger>
            <Tooltip content="Post this image">
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
            <Tooltip content="Edit">
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
            </Tooltip>
          </div>
        </DirectionAwareHover>
      </div>
      <DialogContent className="flex max-h-[80vh] max-w-2xl justify-center overflow-hidden border-none bg-transparent p-0 shadow-none">
        <Image
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
