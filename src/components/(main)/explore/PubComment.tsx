// PublicationDialog.tsx
"use client"

import { Download, Loader, SendHorizontal, Share, Trash, X, Zap } from 'lucide-react';
import ImageDisplay from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import useSWR from 'swr';

import { createComment, deletePublication } from '@/actions/publication.action';
import CommentCard from '@/components/(main)/explore/CommentCard';
import { PublicationDialog as PublicationDialogShare } from '@/components/publication-dialog';
import { Input } from '@/components/tremor/inputs/input';
import { Button } from '@/components/tremor/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/tremor/ui/card';
import {
    Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger
} from '@/components/tremor/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/hooks/use-user';
import { formatDate } from '@/lib/formatDate';
import { removeBg, unzoom, upscale } from '@/lib/leonardo/fetch';
import { models } from '@/lib/leonardo/presets';
import { fetcher } from '@/lib/utils';

import RelatedPublications from './RelatedPublications';

interface PublicationDialogProps {
  children: React.ReactNode
  publication: {
    id: string
    owner: string
    ownerId: string
    ownerImage: string
    description: {
      prompt: string
      model: string
      preset: string
    }
    image: string
    date: Date
  }
}

export default function PublicationDialog({
  children,
  publication,
}: PublicationDialogProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { data: comments, mutate } = useSWR(
    isOpen ? `/api/publication/comment?publicationId=${publication.id}` : null,
    fetcher,
  )
  const { user } = useUser()

  const [comment, setComment] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const model = models.find((m) => m.name === publication.description.model)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handlePostComment = async () => {
    if (!comment.trim()) return
    await createComment(comment, publication.id)
    setComment("")
    mutate()
  }

  const handleImageAction = async (
    action: "unzoom" | "upscale" | "removeBg",
  ) => {
    setIsLoading(true)
    try {
      switch (action) {
        case "unzoom":
          await unzoom(publication.image)
          break
        case "upscale":
          await upscale(publication.image)
          break
        case "removeBg":
          await removeBg(publication.image)
          break
      }
      toast(t(`You can see the result in your gallery page`))
    } catch (error) {
      toast.error("An error occurred while processing the image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (user?.plan == "Free" || user?.plan == "FreePaid") {
      setIsDownloading(true)
      try {
        // Fetch the original image
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(publication.image)}`
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

        const originalFileName =
          publication.image.split("/").pop() || "image.png"
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
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(publication.image)}`
        const response = await fetch(proxyUrl)
        const blob = await response.blob()
        const originalFileName =
          publication.image.split("/").pop() || "image.png"
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

  const handleDeletePublication = async () => {
    setDeleteLoading(true)
    await deletePublication(publication.id)
    // mutateOnDelete("/api/publication/all?model=all&page=1")
    setDeleteLoading(false)
    window.location.reload()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] max-w-none items-start overflow-y-auto p-4">
        <DialogTitle className="sr-only">
          {t(`Publication Details`)}
        </DialogTitle>
        <div className="relative h-full w-full">
          <div className="flex w-full gap-4 max-lg:flex-col">
            <div className="max-w-3/4 relative h-[calc(100vh-8rem)] w-full rounded bg-muted/60 p-4 max-lg:h-fit max-lg:max-w-full max-lg:p-0">
              <ImageDisplay
                src={publication.image}
                alt={publication.description.prompt}
                className="h-full w-full overflow-hidden rounded-lg object-contain"
                width={500}
                height={800}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>

            <div className="flex h-fit max-h-[80vh] w-full max-w-lg flex-col gap-4 space-y-4 p-2">
              <PublicationHeader
                ownerId={publication.ownerId}
                owner={publication.owner}
                ownerImage={publication.ownerImage}
                date={publication.date}
              />

              <PublicationActions
                description={publication.description}
                image={publication.image}
                isLoading={isLoading}
                isDownloading={isDownloading}
                model={model}
                onDownload={handleDownload}
                onImageAction={handleImageAction}
                publication={publication}
              />

              <Separator orientation="horizontal" className="my-6" />

              <CommentSection
                comments={comments}
                comment={comment}
                setComment={setComment}
                onPostComment={handlePostComment}
              />
            </div>
          </div>
          {user?.id == publication.ownerId && (
            <Button
              variant="outline"
              className="absolute right-14 top-2 size-9 p-0"
              onClick={handleDeletePublication}
            >
              {deleteLoading ? (
                <Loader className="animate-spin" size={20} color="red" />
              ) : (
                <Trash
                  size={24}
                  color="red"
                  className="h-4 w-4 text-accent-foreground"
                />
              )}
            </Button>
          )}

          <DialogClose asChild>
            <Button
              variant="outline"
              className="absolute right-2 top-2 size-9 p-0"
            >
              <X className="h-4 w-4 text-accent-foreground" />
            </Button>
          </DialogClose>
        </div>

        {model?.name && (
          <RelatedPublications
            modelName={model.name}
            currentPublicationId={publication.id}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

// Additional _components are split out for clarity
function PublicationHeader({
  ownerId,
  owner,
  ownerImage,
  date,
}: {
  ownerId: string
  owner: string
  ownerImage: string
  date: Date
}) {
  return (
    <Link
      href={`/profile?userId=${ownerId}`}
      className="flex items-center gap-3"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={ownerImage} alt={owner} />
        <AvatarFallback>{owner[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{owner}</p>
        <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
      </div>
    </Link>
  )
}

function PublicationActions({
  description,
  image,
  isLoading,
  isDownloading,
  model,
  onDownload,
  onImageAction,
  publication,
}) {
  const { t } = useTranslation()
  const [isPublicationDialogOpen, setIsPublicationDialogOpen] = useState(false)
  if (isLoading) {
    return (
      <Card>
        <Button className="flex h-8 w-full items-center justify-center gap-2">
          <Loader className="animate-spin" size={20} /> {t(`Loading...`)}
        </Button>
      </Card>
    )
  }

  return (
    <Card>
      {publication && (
        <PublicationDialogShare
          publication={publication}
          isOpen={isPublicationDialogOpen}
          onClose={() => setIsPublicationDialogOpen(false)}
        />
      )}
      <CardTitle>{t(`Prompt details`)}</CardTitle>
      <CardDescription>{description.prompt}</CardDescription>

      <div className="mt-4 flex gap-2">
        <Button
          className="flex h-8 w-full items-center justify-center gap-2"
          onClick={onDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader className="animate-spin" size={20} /> {t(`Loading...`)}
            </>
          ) : (
            <>
              <Download size={20} /> {t(`Download`)}
            </>
          )}
        </Button>
        <Button
          className="mt-0 flex h-8 items-center justify-center gap-2"
          onClick={() => setIsPublicationDialogOpen(true)}
          variant="outline"
        >
          <Share size={20} />
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          {model?.generated_image?.url && (
            <ImageDisplay
              src={model.generated_image.url}
              width={16}
              height={16}
              alt={model.name}
              className="size-4 object-cover"
              onContextMenu={(e) => e.preventDefault()}
            />
          )}
          {model?.name}
        </div>
        <div className="flex items-center gap-2">
          <Zap size={16} />
          <span className="text-muted-foreground">{t(description.preset)}</span>
        </div>
      </div>
    </Card>
  )
}

function CommentSection({ comments, comment, setComment, onPostComment }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onPostComment()
        }}
        className="flex items-center gap-3"
      >
        <Input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t(`Add a comment...`)}
          className="flex-grow"
        />
        <Button
          type="submit"
          className="flex h-10 w-16 items-center justify-center rounded-md p-0 text-white"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </form>

      <div className="flex flex-col gap-4">
        {comments
          ?.filter((comment) => !comment.parentId)
          .map((comment) => <CommentCard key={comment.id} comment={comment} />)}
      </div>
    </div>
  )
}
