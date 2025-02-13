// /api/publication/video
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
    const publicationVideo = await prisma.publicationVideo.findMany({
      include: {
        user: true,
        ReactionVideo: {
          select: {
            id: true,
            userId: true,
            publicationVideo: true,
          },
        },
        CommentVideo: {
          select: {
            id: true,
            userId: true,
            CommentVideoReaction: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const response = publicationVideo.map((publicationVideo) => ({
      ...publicationVideo,
      isLiked: publicationVideo.ReactionVideo.find((p) => p.userId === user.id)
        ? true
        : false,
      reactionVideoCount: publicationVideo.ReactionVideo.length,
      commentVideoCount: publicationVideo.CommentVideo.length,
    }))

    console.log(response)

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect() // Ferme la connexion après chaque requête
  }
}
