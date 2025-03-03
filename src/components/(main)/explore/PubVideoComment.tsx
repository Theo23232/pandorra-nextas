// PublicationDialog.tsx
"use client"

import {
  Clock10,
  Download,
  Frame,
  Loader,
  Scan,
  SendHorizontal,
  Trash,
  X,
} from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import useSWR, { mutate as mutateOnDelete } from "swr"

import { createCommentVideo } from "@/actions/pubVideo.actions"
import { deletePublicationVideo } from "@/actions/runway.actions"
import CommentVideoCard from "@/components/(main)/explore/CommentVideoCard"
import { Input } from "@/components/tremor/inputs/input"
import { Badge } from "@/components/tremor/ui/badge"
import { Button } from "@/components/tremor/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/tremor/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/formatDate"
import { fetcher } from "@/lib/utils"
import { CommentVideoWithAuthor } from "@/types/publicationType"
import { User } from "@prisma/client"

interface PublicationDialogProps {
  children: React.ReactNode
  publication: {
    id: string
    owner: string
    ownerId: string
    ownerImage: string
    prompt: string
    duration: number
    ratio: string
    video: string
    date: Date
  }
}

export default function PubVideoComment({
  children,
  publication,
}: PublicationDialogProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { data: user } = useSWR<User>("/api/auth/user", fetcher)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { data: comments, mutate } = useSWR<CommentVideoWithAuthor[]>(
    `/api/publication/video/commentVideo?publicationVideoId=${publication.id}`,
    fetcher,
  )

  const [comment, setComment] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)

  const handlePostComment = async () => {
    if (!comment.trim()) return
    await createCommentVideo(comment, publication.id)
    setComment("")
    mutate()
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(publication.video)}`
      const response = await fetch(proxyUrl)
      const blob = await response.blob()
      const originalFileName = publication.video.split("/").pop() || "video.mp4"
      const fileName = `Pandorra.ai_${originalFileName}`
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erreur lors du téléchargement de la vidéo :", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDeletePublicationVideo = async () => {
    setDeleteLoading(true)
    await deletePublicationVideo(publication.id)
    mutateOnDelete("/api/publication/video")
    setDeleteLoading(false)
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
            <div className="max-w-3/4 relative h-[calc(100vh-8rem)] w-full overflow-hidden rounded bg-muted/60 p-4 max-lg:h-fit max-lg:max-w-full max-lg:p-0">
              <video
                src={publication.video}
                className={`h-auto max-h-[calc(100vh-8rem)] w-full transform transition-transform duration-1000 ease-in-out`}
                controls={true}
                autoPlay
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
                prompt={publication.prompt}
                isLoading={isLoading}
                isDownloading={isDownloading}
                duration={publication.duration}
                onDownload={handleDownload}
                ratio={publication.ratio}
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
          {user && user.id === publication.ownerId && (
            <Button
              variant="outline"
              className="absolute right-14 top-2 size-9 p-0"
              onClick={handleDeletePublicationVideo}
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
              <X className="h-4 w-4 text-black dark:text-white" />
            </Button>
          </DialogClose>
        </div>
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
    <Link href={`/profile/${ownerId}`} className="flex items-center gap-3">
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
          <CommentVideoCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}

function PublicationActions({
  prompt,
  isLoading,
  isDownloading,
  duration,
  ratio,
  onDownload,
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
    <Card className="flex flex-col gap-4 p-3">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold">{t(`Prompt details`)}</p>
        <p>{prompt}</p>
      </div>
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
      <div className="flex items-center gap-3">
        <Badge className="flex items-center gap-2">
          {" "}
          <Clock10 size={14} /> {duration} s
        </Badge>
        <Badge className="flex items-center gap-2">
          {" "}
          <Frame size={14} /> {ratio}{" "}
        </Badge>
        <Badge>
          {" "}
          <Scan size={14} />
          {ratio === "1280:768" ? t(`Landscape`) : t(`Portrait`)}{" "}
        </Badge>
      </div>
    </Card>
  )
}
