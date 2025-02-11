// PublicationDialog.tsx
"use client"

import { Clock10, Download, Frame, Loader, Scan, SendHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { createCommentVideo } from '@/actions/pubVideo.actions';
import { Input } from '@/components/tremor/inputs/input';
import { Badge } from '@/components/tremor/ui/badge';
import { Button } from '@/components/tremor/ui/button';
import {
    Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger
} from '@/components/tremor/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/formatDate';
import { fetcher } from '@/lib/utils';
import { CommentVideoWithAuthor } from '@/types/publicationType';

import CommentCard from './CommentCard';

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
  const { data: comments, mutate } = useSWR<CommentVideoWithAuthor[]>(
    `/api/publication/video/commentVideo?publicationVideoId=${publication.id}`,
    fetcher,
  )

  const [comment, setComment] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handlePostComment = async () => {
    if (!comment.trim()) return
    await createCommentVideo(comment, publication.id)
    setComment("")
    mutate()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] max-w-none items-start overflow-scroll p-4">
        <DialogTitle className="sr-only">
          {t(`Publication Details`)}
        </DialogTitle>
        <div className="relative h-full w-full">
          <DialogClose asChild>
            <Button variant="outline" className="absolute right-2 top-2">
              <X className="h-4 w-4 text-black dark:text-white" />
            </Button>
          </DialogClose>

          <div className="flex w-full gap-4">
            <div className="max-w-3/4 relative h-[calc(100vh-8rem)] w-full rounded bg-muted/60 p-4">
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
                duration={publication.duration}
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
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}

function PublicationActions({ prompt, isLoading, duration, ratio }) {
  const { t } = useTranslation()
  if (isLoading) {
    return (
      <Card>
        <Button className="flex h-8 w-full items-center justify-center gap-2">
          <Loader className="animate-spin" size={20} /> {t(`Loading`)}
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
      <Button className="flex h-8 w-full items-center justify-center gap-2">
        <Download size={20} /> {t(`Download`)}
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
