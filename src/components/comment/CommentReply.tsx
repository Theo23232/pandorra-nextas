"use client"

import { Heart } from "lucide-react"
import { useState } from "react"

import {
  createCommentReaction,
  deleteCommentReaction,
} from "@/actions/publication.action"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/lib/formatDate"

interface CommentReplyProps {
  reply: {
    id: string
    user: {
      id: string
      image: string
      username: string
    }
    date: string
    CommentReaction: {
      id: string
      userId: string
    }[]
    isLiked: boolean
    parentId: string
    text: string
  }
}

export default function CommentReply({ reply }: CommentReplyProps) {
  const [isLiked, setIsLiked] = useState<boolean>(reply.isLiked)
  const [likeCount, setLikeCount] = useState<number>(
    reply.CommentReaction.length,
  )

  const handleReaction = async () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(likeCount - 1)
      await deleteCommentReaction(reply.id)
    } else {
      setIsLiked(true)
      setLikeCount(likeCount + 1)
      await createCommentReaction(reply.id)
    }
  }
  return (
    <div key={reply.id} className="flex flex-col items-start gap-4 p-4">
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
        <p className="text-sm">{reply.text}</p>
      </div>
    </div>
  )
}
