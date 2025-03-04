"use server"

import { trackUserActivity } from "@/actions/user.ations"
import { currentUser } from "@/lib/current-user"
import { SA } from "@/lib/safe-ation"
import { prisma } from "@/prisma"

export const createPublication = async (
  imageUrl: string,
  prompt: string,
  model: string,
  preset: string,
  generationType: string,
) => {
  const user = await currentUser()
  await trackUserActivity("createPublication")

  const publication = await prisma.publication.findFirst({
    where: {
      imageUrl: imageUrl,
    },
  })
  if (publication) throw new Error("An image cannot be published twice")
  if (user) {
    await prisma.publication.create({
      data: {
        userId: user.id,
        imageUrl: imageUrl,
        prompt: prompt,
        model: model,
        preset: preset,
        generationType: generationType,
      },
    })
  } else throw new Error("You are not authenticated")
}

export const createComment = async (text: string, publicationId: string) => {
  await trackUserActivity("createComment")

  const user = await currentUser()

  if (user) {
    await prisma.comment.create({
      data: {
        text: text,
        userId: user.id,
        publicationId: publicationId,
      },
    })
  } else throw new Error("You are not authenticated")
}

export const deleteComment = async (publicationId: string) => {
  const user = await currentUser()
  await trackUserActivity("deleteComment")

  if (!user) {
    throw new Error("You are not athenticated")
  }

  await prisma.comment.delete({
    where: {
      id: publicationId,
    },
  })
}

export const replyComment = async (
  publicationId: string,
  text: string,
  parentId: string,
) => {
  await trackUserActivity("createComment")

  const user = await currentUser()

  const isExistParent = await prisma.comment.findUnique({
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

  const replyComment = await prisma.comment.create({
    data: {
      text: text,
      userId: user.id,
      publicationId: publicationId,
      parentId: parentId,
    },
  })
}

export const createPubReaction = async (publicationId: string) => {
  await trackUserActivity("createPubReaction")

  const user = await currentUser()

  if (user) {
    const isExist = await prisma.reaction.findFirst({
      where: {
        userId: user.id,
        publicationId: publicationId,
      },
    })
    if (!isExist) {
      await prisma.reaction.create({
        data: {
          userId: user.id,
          publicationId: publicationId,
        },
      })
    }
  } else throw new Error("You are not authenticated")
}

export const deletePubReaction = async (publicationId: string) => {
  const user = await currentUser()
  await trackUserActivity("deletePubReaction")

  if (user) {
    const isExist = await prisma.reaction.findFirst({
      where: {
        userId: user.id,
        publicationId: publicationId,
      },
    })
    if (isExist) {
      await prisma.reaction.delete({
        where: {
          id: isExist.id,
        },
      })
    }
  }
}

export const createCommentReaction = async (commentId: string) => {
  const user = await currentUser()
  await trackUserActivity("createCommentReaction")

  if (user) {
    const isExist = await prisma.commentReaction.findFirst({
      where: {
        userId: user.id,
        commentId: commentId,
      },
    })
    if (!isExist) {
      await prisma.commentReaction.create({
        data: {
          userId: user.id,
          commentId: commentId,
        },
      })
    }
  } else throw new Error("You are not authenticated")
}

export const deleteCommentReaction = async (commentId: string) => {
  const user = await currentUser()
  await trackUserActivity("deleteCommentReaction")

  if (user) {
    const isExist = await prisma.commentReaction.findFirst({
      where: {
        userId: user.id,
        commentId: commentId,
      },
    })
    if (isExist) {
      await prisma.commentReaction.delete({
        where: {
          id: isExist.id,
        },
      })
    }
  }
}

export const deletePublication = SA(
  async (user, pubId: string): Promise<null> => {
    await prisma.publication.delete({
      where: {
        id: pubId,
      },
    })
    return null
  },
)
