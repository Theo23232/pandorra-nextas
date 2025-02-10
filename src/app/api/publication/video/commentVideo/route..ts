// /app/api/publication/comment/route.ts
import { NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export async function GET(request: Request) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get publicationId from URL search params
  const { searchParams } = new URL(request.url)
  const publicationVideoId = searchParams.get("publicationVideoId")

  if (!publicationVideoId) {
    return NextResponse.json(
      { error: "Publication ID is required" },
      { status: 400 },
    )
  }

  try {
    const comments = await prisma.commentVideo.findMany({
      where: {
        publicationVideoId: publicationVideoId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        CommentVideoReaction: {
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

    // Transform the data to include isLiked and reaction count
    const formattedComments = comments.map((comment) => ({
      ...comment,
      isLiked: comment.CommentVideoReaction.some(
        (reaction) => reaction.userId === user.id,
      ),
      reactionVideoCount: comment.CommentVideoReaction.length,
      // Remove the raw reaction data since we've processed it
      commentVideoReaction: undefined,
    }))

    return NextResponse.json(formattedComments, { status: 200 })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
