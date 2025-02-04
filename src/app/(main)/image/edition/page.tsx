"use client"

import {
  Download,
  Eraser,
  Expand,
  Fullscreen,
  Loader,
  Trash,
} from "lucide-react"
import Image from "next/image"
import * as React from "react"
import Masonry from "react-masonry-css"
import { toast } from "sonner"
import useSWR, { useSWRConfig } from "swr"

import { WatchOriginal } from "@/components/image-ai/watch-original"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { fetcher } from "@/lib/utils"
import { UserImage } from "@prisma/client"

export default function Page() {
  const { data: collection } = useSWR<UserImage[]>(
    "/api/user/collection",
    fetcher,
  )
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)
  const [localCollection, setLocalCollection] = React.useState<
    UserImage[] | undefined
  >(collection)

  const [urlLoading, setUrlLoading] = React.useState<string>("")
  const { mutate } = useSWRConfig()

  React.useEffect(() => {
    setLocalCollection(collection)
  }, [collection])

  const handleUnzoom = async (imageUrl: string) => {
    setUrlLoading(imageUrl)
    mutate("/api/user/image-edition")
    setUrlLoading("")
  }
  const handleUpscale = async (imageUrl: string) => {
    setUrlLoading(imageUrl)
    mutate("/api/user/image-edition")
    setUrlLoading("")
  }

  const handleDelete = async (imageUrl: string) => {
    setUrlLoading(imageUrl)
    try {
      setLocalCollection((prev) =>
        prev?.filter((image) => image.imageUrl !== imageUrl),
      )
    } catch (error) {
      console.error("Erreur lors de la suppression :", error)
    } finally {
      setUrlLoading("")
      toast("Variant deleted")
      mutate("/api/user/image-edition")
    }
  }

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const fileName = imageUrl.split("/").pop() || "image.png"
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

  const handleRemoveBg = async (imageUrl: string) => {
    setUrlLoading(imageUrl)
    mutate("/api/user/image-edition")
    setUrlLoading("")
  }
  return (
    <div className="">
      <div className="w-full cursor-pointer">
        <Masonry
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
          breakpointCols={{
            default: 5,
            1440: 3,
            1200: 2,
            700: 1,
          }}
        >
          {localCollection
            ?.filter((image) => image.isAIGenerated)
            .map((image) => (
              <div
                className="group relative m-2 h-fit w-full overflow-hidden rounded-lg bg-muted shadow"
                key={image.id}
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <WatchOriginal imageId={image.id} isVariant={image.isVariant}>
                  <Image
                    width={400}
                    height={400}
                    alt={image.imageUrl}
                    src={image.imageUrl}
                    className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </WatchOriginal>
                {urlLoading != image.imageUrl && hoveredId === image.id && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <Card>
                        <CardHeader className="p-2 pb-0">
                          <Button
                            size={"sm"}
                            className="flex h-8 w-full items-center justify-center gap-2"
                            onClick={() => handleDownload(image.imageUrl)}
                          >
                            <Download size={20} /> Download
                          </Button>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center gap-2 p-2">
                          <Button
                            variant={"secondary"}
                            size={"sm"}
                            className="flex h-8 w-full items-center justify-center gap-2"
                            onClick={() => handleUnzoom(image.imageUrl)}
                          >
                            <Fullscreen size={20} /> Unzoom
                          </Button>
                          <Button
                            variant={"secondary"}
                            size={"sm"}
                            className="flex h-8 w-full items-center justify-center gap-2"
                            onClick={() => handleUpscale(image.imageUrl)}
                          >
                            <Expand size={20} />
                            Upscale
                          </Button>
                          <Button
                            variant={"secondary"}
                            size={"sm"}
                            className="flex h-8 w-full items-center justify-center gap-2"
                            onClick={() => handleRemoveBg(image.imageUrl)}
                          >
                            <Eraser size={20} /> Remove background
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    {image.isVariant && (
                      <div className="absolute right-2 top-8">
                        <Button
                          variant={"destructive"}
                          className="flex h-8 w-full items-center justify-center gap-2"
                          onClick={() => handleDelete(image.id)}
                        >
                          <Trash size={20} />
                        </Button>
                      </div>
                    )}
                  </>
                )}
                {urlLoading == image.imageUrl && (
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <Card>
                      <CardContent className="flex items-center justify-center gap-2 p-2">
                        <Button
                          size={"sm"}
                          className="flex h-8 w-full items-center justify-center gap-2"
                        >
                          <Loader size={20} className="animate-spin" /> Loading
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {image.isVariant && (
                  <Badge className="absolute right-2 top-2">Variant</Badge>
                )}
              </div>
            ))}
        </Masonry>
      </div>
    </div>
  )
}
