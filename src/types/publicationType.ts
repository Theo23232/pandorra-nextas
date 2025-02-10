import { Prisma, User } from "@prisma/client"

export type PublicationWithAuthor = Omit<
  Prisma.PublicationGetPayload<{
    include: { user: true; reaction: true; comment: true }
  }>,
  "user"
> & {
  user: Pick<User, "id" | "fullname" | "username" | "image">
  isLiked: boolean
  prompt: string
  model: string
  preset: string
  reactionsCount: number
  commentCount: number
}
export type PublicationVideoWithAuthor = Omit<
  Prisma.PublicationVideoGetPayload<{
    include: { user: true; ReactionVideo: true; CommentVideo: true }
  }>,
  "user"
> & {
  user: Pick<User, "id" | "fullname" | "username" | "image">
  isLiked: boolean
  prompt: string
  url: string
  duration: string
  ratio: number
  reactionVideoCount: number
  commentVideoCount: number
}

export type CommentWithAuthor = Omit<
  Prisma.CommentGetPayload<{
    include: { user: true }
  }>,
  "user"
> & {
  user: Pick<User, "id" | "fullname" | "username" | "image">
  isLiked: boolean
  commentReaction: number
}
