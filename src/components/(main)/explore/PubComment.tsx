"use client"

import {
  Download,
  Eraser,
  Expand,
  Fullscreen,
  Loader,
  SendHorizontal,
  Zap,
} from "lucide-react"
import Image from "next/image"
import React, { useState } from "react"
import { toast } from "sonner"
import useSWR from "swr"

import { createComment } from "@/actions/publication.action"
import { Input } from "@/components/tremor/inputs/input"
import { Button } from "@/components/tremor/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/tremor/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/formatDate"
import { removeBg, unzoom, upscale } from "@/lib/leonardo/fetch"
import { models } from "@/lib/leonardo/presets"
import { fetcher } from "@/lib/utils"
import {
  CommentWithAuthor,
  PublicationWithAuthor,
} from "@/types/publicationType"

import CommentCard from "./CommentCard"

interface PubCommentProps {
  children: React.ReactNode
  pubOwner: string
  pubOwnerImage: string
  pubDescription: {
    prompt: string
    model: string
    preset: string
  }
  pubLikeCount: number
  pubIsLike: boolean
  pubId: string
  image: string
  date: Date
}

export default function PubComment({
  children,
  pubOwner,
  pubOwnerImage,
  pubDescription,
  pubId,
  image,
  date,
}: PubCommentProps) {
  const { data: comments, mutate } = useSWR<CommentWithAuthor[]>(
    `/api/publication/comment/${pubId}`,
    fetcher,
  )

  const [comment, setComment] = useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const model = models.find((m) => m.name === pubDescription.model)

  const handlePostComment = async () => {
    if (!comment.trim()) return
    await createComment(comment, pubId)
    setComment("")
    mutate()
  }

  const handleUnzoom = async (imageUrl: string) => {
    setIsLoading(true)
    await unzoom(imageUrl!)
    toast("You can see the result in your gallery page")
    setIsLoading(false)
  }
  const handleUpscale = async (imageUrl: string) => {
    setIsLoading(true)
    await upscale(imageUrl!)
    toast("You can see the result in your gallery page")
    setIsLoading(false)
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
    setIsLoading(true)
    await removeBg(imageUrl!)
    toast("You can see the result in the gallery page")
    setIsLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[90vh] max-w-6xl items-start overflow-hidden p-4">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-fit w-full">
              <Image
                src={image}
                alt={pubDescription.prompt}
                className="h-auto w-full rounded-lg object-cover shadow-lg"
                width={500}
                height={800}
              />
            </div>
            <div className="flex h-fit max-h-[80vh] w-full flex-col gap-6 space-y-6 p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={pubOwnerImage} alt={pubOwner} />
                    <AvatarFallback>{pubOwner[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{pubOwner}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(date)}
                    </p>
                  </div>
                </div>
                <Card>
                  <CardHeader className="pb-2 text-base font-medium">
                    Prompt details
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {pubDescription.prompt}
                    </p>
                    {!isLoading ? (
                      <Card>
                        <div className="">
                          <Button
                            className="flex h-8 w-full items-center justify-center gap-2"
                            onClick={() => handleDownload(image)}
                          >
                            <Download size={20} /> Download
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <Button
                            variant={"secondary"}
                            className="flex h-8 w-full flex-1 items-center justify-center gap-2"
                            onClick={() => handleUnzoom(image)}
                          >
                            <Fullscreen size={20} /> Unzoom
                          </Button>
                          <Button
                            variant={"secondary"}
                            className="flex h-8 w-full flex-1 items-center justify-center gap-2"
                            onClick={() => handleUpscale(image)}
                          >
                            <Expand size={20} />
                            Upscale
                          </Button>
                          <Button
                            variant={"secondary"}
                            className="flex h-8 w-full flex-1 items-center justify-center gap-2"
                            onClick={() => handleRemoveBg(image)}
                          >
                            <Eraser size={20} /> Bg Remove
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      <Card>
                        <CardHeader className="p-2">
                          <Button className="flex h-8 w-full items-center justify-center gap-2">
                            <Loader className="animate-spin" size={20} />{" "}
                            Loading
                          </Button>
                        </CardHeader>
                      </Card>
                    )}
                  </CardContent>
                </Card>
                <div className="flex items-center gap-4 text-xs">
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
                    <span className="text-muted-foreground">
                      {pubDescription.preset}
                    </span>
                  </div>
                </div>
              </div>
              <Separator orientation="horizontal" className="my-6" />
              <CommentInput
                comment={comment}
                setComment={setComment}
                handlePostComment={handlePostComment}
              />

              <div className="flex flex-col gap-4">
                {comments?.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          </div>
          <RelatedPost model={model?.name!} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

interface CommentInputProps {
  comment: string
  setComment: (comment: string) => void
  handlePostComment: () => void
}

function CommentInput({
  comment,
  setComment,
  handlePostComment,
}: CommentInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handlePostComment()
      }}
      className="mb-6 flex items-center gap-3"
    >
      <Input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-grow"
      />
      <button
        type="submit"
        className="flex h-12 w-16 items-center justify-center rounded-md bg-primary p-0"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>
    </form>
  )
}

export const RelatedPost = ({ model }: { model: string }) => {
  const {
    data: publications,
    error,
    isLoading,
  } = useSWR<PublicationWithAuthor[]>(
    `/api/publication/model?modelName=${model}`,
    fetcher,
    { refreshInterval: 10000 },
  )
  if (publications) {
    return (
      <div className="">
        <Separator orientation="horizontal" className="my-6" />
        <div className="mb-6 text-lg font-bold">Related posts</div>
        <div className="grid grid-cols-3 gap-4 pr-4">
          {publications.slice(0, 9).map((pub) => (
            <PubComment
              key={pub.id}
              pubOwner={pub.user.username ?? ""}
              pubOwnerImage={pub.user.image}
              pubId={pub.id}
              pubLikeCount={pub.reactionsCount}
              pubIsLike={pub.isLiked}
              pubDescription={{
                prompt: pub.prompt,
                model: pub.model,
                preset: pub.preset,
              }}
              date={pub.createdAt}
              image={pub.imageUrl}
            >
              <div className="pb-100% relative aspect-square w-full">
                <Image
                  src={pub.imageUrl}
                  alt={pub.prompt}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg bg-muted"
                />
              </div>
            </PubComment>
          ))}
        </div>
      </div>
    )
  }
}
