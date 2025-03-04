"use client"

import { ChevronDown, ChevronUp, Heart, Loader, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { mutate } from "swr"

import {
  createCommentReaction,
  deleteCommentReaction,
  replyComment,
} from "@/actions/publication.action"
import { Card, CardContent } from "@/components/tremor/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/hooks/use-user"
import { formatDate } from "@/lib/formatDate"
import { CommentWithAuthor } from "@/types/publicationType"

interface CommentCardProps {
  comment: CommentWithAuthor
}

export default function CommentCard(props: CommentCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(props.comment.isLiked)
  const [likeCount, setLikeCount] = useState<number>(
    props.comment.reactionCount,
  )

  const [replyCommentIsOpen, setReplyCommentOpen] = useState<boolean>(false)
  const [replyCommentText, setReplyCommentText] = useState<string>("")
  const [replyCommentLoading, setReplyCommentLoading] = useState<boolean>(false)

  const { user } = useUser()

  const handleReaction = async () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(likeCount - 1)
      await deleteCommentReaction(props.comment.id)
    } else {
      setIsLiked(true)
      setLikeCount(likeCount + 1)
      await createCommentReaction(props.comment.id)
    }
  }
  const handleReplySubmit = async () => {
    setReplyCommentLoading(true)
    await replyComment(
      props.comment.publicationId,
      replyCommentText,
      props.comment.id,
    )
    mutate(
      `/api/publication/comment?publicationId=${props.comment.publicationId}`,
    )
    setReplyCommentText("")
    setReplyCommentLoading(false)
  }

  useEffect(() => {}, [likeCount, isLiked])

  return (
    <Card className="p-0">
      <CardContent className="p-3">
        <div className="flex flex-col gap-3">
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
                  onClick={() => handleReaction()}
                />
              ) : (
                <Heart
                  className="cursor-pointer md:size-4 2xl:size-5"
                  color="gray"
                  onClick={() => handleReaction()}
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
              onClick={() => setReplyCommentOpen(!replyCommentIsOpen)}
            >
              <p className="px-2 text-sm hover:underline">Reply</p>
              {replyCommentIsOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          </div>

          {replyCommentIsOpen && (
            <div className="mt-2 flex flex-col gap-3 pl-5">
              <div className="mb-3 flex flex-col gap-3">
                {props.comment.childComments.map((reply) => (
                  <Card
                    key={reply.id}
                    className="flex flex-col items-start gap-4 p-4"
                  >
                    <div className="relative flex w-full gap-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={reply.user.image} alt="User" />
                        <AvatarFallback>
                          {reply.user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <p className="text-sm font-semibold">
                          {reply.user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(reply.date)}
                        </p>
                      </div>
                      {/* <div className="absolute right-2 flex items-center gap-1">
                        {reply.CommentReaction.some(
                          (reaction) => reaction.id === user?.id,
                        ) ? (
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
                        {reply.CommentReaction.some(
                          (reaction) => reaction.id === user?.id,
                        ) ? (
                          <p className="text-gray-500">
                            {reply.CommentReaction.length}
                          </p>
                        ) : (
                          <p className="text-gray-500">0</p>
                        )}
                      </div> */}
                      <p className="text-sm">{reply.text}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Reply input */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Write a reply..."
                  value={replyCommentText}
                  onChange={(e) => setReplyCommentText(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyCommentText.trim()}
                >
                  {replyCommentLoading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
