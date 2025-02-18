import { NextRequest, NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const publicationId = searchParams.get("imageId")

  const user = await currentUser()

  if (!publicationId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    )
  }

  if (!user) {
    return NextResponse.json(
      { error: "You are not connected" },
      { status: 401 },
    )
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { publicationId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        commentReaction: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    const response = comments.map((comment) => ({
      ...comment,
      isLiked: comment.commentReaction.find((c) => c.userId === user.id)
        ? true
        : false,
      commentReaction: comment.commentReaction.length,
    }))

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  } finally {
    console.info("") // Ferme la connexion après chaque requête
  }
}
