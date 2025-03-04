"use server"

import { trackUserActivity } from "@/actions/user.ations"
import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export const createPublicationVideo = async (
  id: string,
  url: string,
  prompt: string,
  duration: number,
  ratio: string,
  status: string,
) => {
  const user = await currentUser()
  await trackUserActivity("createPublicationVideo")

  const publicationVideo = await prisma.publicationVideo.findFirst({
    where: {
      id: id,
    },
  })
  if (publicationVideo) throw new Error("An image cannot be published twice")
  if (user) {
    await prisma.publicationVideo.create({
      data: {
        userId: user.id,
        videoUrl: url,
        prompt: prompt,
        duration: duration,
        ratio: ratio,
        status: status,
      },
    })
  } else throw new Error("You are not authenticated")
}

export const createCommentVideo = async (
  text: string,
  publicationVideoId: string,
) => {
  const user = await currentUser()
  await trackUserActivity("createCommentVideo")

  if (user) {
    await prisma.commentVideo.create({
      data: {
        text: text,
        userId: user.id,
        publicationVideoId: publicationVideoId,
      },
    })
  } else throw new Error("You are not authenticated")
}

export const deleteCommentVideo = async (publicationVideoId: string) => {
  const user = await currentUser()
  await trackUserActivity("deleteCommentVideo")

  if (!user) {
    throw new Error("You are not athenticated")
  }

  await prisma.commentVideo.delete({
    where: {
      id: publicationVideoId,
    },
  })
}

export const replyCommentVideo = async (
  publicationVideoId: string,
  text: string,
  parentId: string,
) => {
  await trackUserActivity("createComment")

  const user = await currentUser()

  const isExistParent = await prisma.commentVideo.findUnique({
    where: {
      id: parentId,
    },
  })

  if (!user) {
    throw new Error("You must be connected")
  }

  if (!isExistParent) {
    throw new Error("You must be connected")
  }

  const replyCommentVideo = await prisma.commentVideo.create({
    data: {
      text: text,
      userId: user.id,
      publicationVideoId: publicationVideoId,
      parentId: parentId,
    },
  })
}

export const createPubVideoReaction = async (publicationVideoId: string) => {
  const user = await currentUser()
  await trackUserActivity("createPubVideoReaction")

  if (user) {
    const isExist = await prisma.reactionVideo.findFirst({
      where: {
        userId: user.id,
        publicationVideoId: publicationVideoId,
      },
    })
    if (!isExist) {
      await prisma.reactionVideo.create({
        data: {
          userId: user.id,
          publicationVideoId: publicationVideoId,
        },
      })
    }
  } else throw new Error("You are not authenticated")
}

export const createCommentVideoReaction = async (commentId: string) => {
  const user = await currentUser()
  await trackUserActivity("createCommentVideoReaction")

  if (user) {
    const isExist = await prisma.commentVideoReaction.findFirst({
      where: {
        userId: user.id,
        commentVideoId: commentId,
      },
    })
    if (!isExist) {
      await prisma.commentVideoReaction.create({
        data: {
          userId: user.id,
          commentVideoId: commentId,
        },
      })
    }
  } else throw new Error("You are not authenticated")
}

export const deleteCommentVideoReaction = async (commentId: string) => {
  const user = await currentUser()
  await trackUserActivity("deleteCommentVideoReaction")

  if (user) {
    const isExist = await prisma.commentVideoReaction.findFirst({
      where: {
        userId: user.id,
        commentVideoId: commentId,
      },
    })
    if (isExist) {
      await prisma.commentVideoReaction.delete({
        where: {
          id: isExist.id,
        },
      })
    }
  }
}

export const deletePubVideoReaction = async (publicationId: string) => {
  const user = await currentUser()
  await trackUserActivity("deletePubVideoReaction")

  if (user) {
    const isExist = await prisma.reactionVideo.findFirst({
      where: {
        userId: user.id,
        publicationVideoId: publicationId,
      },
    })
    if (isExist) {
      await prisma.reactionVideo.delete({
        where: {
          id: isExist.id,
        },
      })
    }
  }
}
