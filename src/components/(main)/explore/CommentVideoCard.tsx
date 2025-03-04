"use client"

import { ChevronDown, ChevronUp, Heart, Send } from "lucide-react"
import { useState } from "react"
import { mutate } from "swr"

import {
  createCommentVideoReaction,
  deleteCommentVideoReaction,
  replyCommentVideo,
} from "@/actions/pubVideo.actions"
import ReplyVideoCommentCard from "@/components/(main)/explore/ReplyVideoCommentCard"
import { Card, CardContent } from "@/components/tremor/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/hooks/use-user"
import { formatDate } from "@/lib/formatDate"

import type { CommentVideoWithAuthor } from "@/types/publicationType"
interface CommentVideoCardProps {
  comment: CommentVideoWithAuthor
}

export default function CommentVideoCard(props: CommentVideoCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(props.comment.isLiked)
  const [likeCount, setLikeCount] = useState<number>(
    props.comment.reactionVideoCount,
  )
  const [replyIsOpen, setReplyOpen] = useState<boolean>(false)
  const [replyText, setReplyText] = useState<string>("")
  const [replyVideoCommentLoading, setReplyVideoCommentLoading] =
    useState<boolean>(false)

  const { user } = useUser()

  const handleReaction = async (id: string) => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(likeCount - 1)
      await deleteCommentVideoReaction(id)
    } else {
      setIsLiked(true)
      setLikeCount(likeCount + 1)
      await createCommentVideoReaction(id)
    }
  }

  const handleReplySubmit = async () => {
    setReplyVideoCommentLoading(true)
    await replyCommentVideo(
      props.comment.publicationVideoId,
      replyText,
      props.comment.id,
    )
    mutate(
      `/api/publication/video/commentVideo?publicationVideoId=${props.comment.publicationVideoId}`,
    )
    setReplyText("")
    setReplyVideoCommentLoading(false)
  }

  return (
    <Card className="mb-2 p-0">
      <CardContent className="p-3">
        <div className="flex flex-col">
          <div className="relative flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={props.comment.user.image} alt="User" />
              <AvatarFallback>{props.comment.user.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">
                {props.comment.user.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(props.comment.date)}
              </p>
            </div>
            <div className="absolute right-2 flex items-center gap-1">
              {isLiked ? (
                <Heart
                  className="cursor-pointer md:size-4 2xl:size-5"
                  fill="red"
                  color="red"
                  onClick={() => handleReaction(props.comment.id)}
                />
              ) : (
                <Heart
                  className="cursor-pointer md:size-4 2xl:size-5"
                  color="gray"
                  onClick={() => handleReaction(props.comment.id)}
                />
              )}
              {likeCount !== 0 ? (
                <p className="text-gray-500">{likeCount}</p>
              ) : (
                <p className="text-gray-500">0</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="px-2">{props.comment.text}</p>
            <div
              className="flex cursor-pointer items-center text-muted-foreground"
              onClick={() => setReplyOpen(!replyIsOpen)}
            >
              <p className="px-2 text-sm hover:underline">Reply</p>
              {replyIsOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          </div>

          {replyIsOpen && (
            <div className="mt-2 flex flex-col gap-3 pl-5">
              <div className="mb-3 flex flex-col gap-3">
                {props.comment.childVideoComments.map((reply) => (
                  <div className="" key={reply.id}>
                    <ReplyVideoCommentCard
                      reply={{
                        ...reply,
                        isLiked: reply.CommentVideoReaction.some(
                          (reaction) => reaction.userId === user?.id,
                        ),
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Reply input */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim()}
                >
                  {/* {replyVideoCommentLoading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Send className="h-4 w-4" />
                  )} */}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
