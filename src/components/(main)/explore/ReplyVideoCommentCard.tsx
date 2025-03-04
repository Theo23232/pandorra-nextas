"use client"

import { Heart } from "lucide-react"
import { useState } from "react"

import {
  createCommentVideoReaction,
  deleteCommentVideoReaction,
} from "@/actions/pubVideo.actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { useUser } from "@/hooks/use-user"
import { formatDate } from "@/lib/formatDate"

interface ReplyVideoCommentCardProps {
  reply: {
    id: string
    user: {
      id: string
      image: string
      username: string
    }
    date: string
    CommentVideoReaction: {
      id: string
      userId: string
    }[]
    isLiked: boolean
    parentId: string
    text: string
  }
}

export default function ReplyVideoCommentCard({
  reply,
}: ReplyVideoCommentCardProps) {
  const { user } = useUser()
  const [isLiked, setIsLiked] = useState<boolean>(reply.isLiked)
  const [likeCount, setLikeCount] = useState<number>(
    reply.CommentVideoReaction.length,
  )

  const handleReaction = async () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(likeCount - 1)
      await deleteCommentVideoReaction(reply.id)
    } else {
      setIsLiked(true)
      setLikeCount(likeCount + 1)
      await createCommentVideoReaction(reply.id)
    }
  }
  return (
    <Card key={reply.id} className="flex flex-col items-start gap-4 p-4">
      <div className="relative flex w-full gap-2">
        <Avatar className="h-9 w-9">
          <AvatarImage src={reply.user.image} alt="User" />
          <AvatarFallback>{reply.user.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <p className="text-sm font-semibold">{reply.user.username}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(reply.date)}
          </p>
        </div>
        <div className="absolute right-2 flex items-center gap-1">
          {isLiked ? (
            <Heart
              className="cursor-pointer md:size-4 2xl:size-5"
              fill="red"
              color="red"
              onClick={() => {
                handleReaction()
              }}
            />
          ) : (
            <Heart
              className="cursor-pointer md:size-4 2xl:size-5"
              color="gray"
              onClick={() => handleReaction()}
            />
          )}
          {isLiked ? (
            <p className="text-gray-500">{likeCount}</p>
          ) : (
            <p className="text-gray-500">0</p>
          )}
        </div>
      </div>
      <p className="text-sm">{reply.text}</p>
    </Card>
  )
}
