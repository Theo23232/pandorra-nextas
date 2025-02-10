"use server"

import { NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export const GET = async () => {
  const user = await currentUser()
  if (!user) {
    throw new Error("You are not connected")
  }
  try {
    const publications = await prisma.publication.findMany({
      include: {
        user: true,
        reaction: {
          select: {
            id: true,
            userId: true,
            publicationId: true,
          },
        },
        comment: {
          select: {
            id: true,
            userId: true,
            commentReaction: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const response = publications.map((publication) => ({
      ...publication,
      isLiked: publication.reaction.find((p) => p.userId === user.id)
        ? true
        : false,
      reactionsCount: publication.reaction.length,
      commentCount: publication.comment.length,
    }))

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect() // Ferme la connexion après chaque requête
  }
}
