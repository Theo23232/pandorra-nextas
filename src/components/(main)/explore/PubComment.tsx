// PublicationDialog.tsx
"use client"

import {
  Download,
  Eraser,
  Expand,
  Fullscreen,
  Loader,
  SendHorizontal,
  X,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import useSWR from "swr"

import { createComment } from "@/actions/publication.action"
import { Input } from "@/components/tremor/inputs/input"
import { Button } from "@/components/tremor/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/tremor/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/tremor/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/formatDate"
import { removeBg, unzoom, upscale } from "@/lib/leonardo/fetch"
import { models } from "@/lib/leonardo/presets"
import { fetcher } from "@/lib/utils"
import { CommentWithAuthor } from "@/types/publicationType"

import CommentCard from "./CommentCard"
import RelatedPublications from "./RelatedPublications"

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
  const { data: comments, mutate } = useSWR<CommentWithAuthor[]>(
    isOpen ? `/api/publication/comment?publicationId=${publication.id}` : null, // Conditional fetch
    fetcher,
  )

  const [comment, setComment] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const model = models.find((m) => m.name === publication.description.model)

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
    setIsDownloading(true)
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(publication.image)}`
      const response = await fetch(proxyUrl)
      const blob = await response.blob()
      const originalFileName = publication.image.split("/").pop() || "image.png"

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
      toast.error("Error downloading image")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] max-w-none items-start overflow-y-scroll p-4">
        <DialogTitle className="sr-only">
          {t(`Publication Details`)}
        </DialogTitle>
        <div className="relative h-full w-full">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="absolute right-2 top-2 size-9 p-0"
            >
              <X className="h-4 w-4 text-accent-foreground" />
            </Button>
          </DialogClose>

          <div className="flex w-full gap-4">
            <div className="max-w-3/4 relative h-[calc(100vh-8rem)] w-full rounded bg-muted/60 p-4">
              <Image
                src={publication.image}
                alt={publication.description.prompt}
                className="h-full w-full overflow-hidden rounded-lg object-contain"
                width={500}
                height={800}
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

// Additional components are split out for clarity
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
}) {
  const { t } = useTranslation()
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
      <CardTitle>{t(`Prompt details`)}</CardTitle>
      <CardDescription>{description.prompt}</CardDescription>

      <div className="mt-4 space-y-2">
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

        <div className="hidden items-center justify-center gap-2">
          <Button
            variant="secondary"
            className="flex h-8 w-full flex-1 items-center justify-center gap-2"
            onClick={() => onImageAction("unzoom")}
          >
            <Fullscreen size={20} /> {t(`Unzoom`)}
          </Button>
          <Button
            variant="secondary"
            className="flex h-8 w-full flex-1 items-center justify-center gap-2"
            onClick={() => onImageAction("upscale")}
          >
            <Expand size={20} /> {t(`Upscale`)}
          </Button>
          <Button
            variant="secondary"
            className="flex h-8 w-full flex-1 items-center justify-center gap-2"
            onClick={() => onImageAction("removeBg")}
          >
            <Eraser size={20} /> {t(`BG Remove`)}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          {model?.generated_image?.url && (
            <Image
              src={model.generated_image.url}
              width={16}
              height={16}
              alt={model.name}
              className="size-4 object-cover"
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
        {comments?.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
