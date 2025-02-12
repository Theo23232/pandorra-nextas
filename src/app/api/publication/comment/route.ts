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
  const publicationId = searchParams.get("publicationId")

  if (!publicationId) {
    return NextResponse.json(
      { error: "Publication ID is required" },
      { status: 400 },
    )
  }

  try {
    const comments = await prisma.comment
      .findMany({
        where: {
          publicationId: publicationId,
        },
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
      .catch((e) => {
        console.log("comments error ==> ", e)
        throw new Error(e)
      })

    // Transform the data to include isLiked and reaction count
    const formattedComments = comments.map((comment) => ({
      ...comment,
      isLiked: comment.commentReaction.some(
        (reaction) => reaction.userId === user.id,
      ),
      reactionCount: comment.commentReaction.length,
      // Remove the raw reaction data since we've processed it
      commentReaction: undefined,
    }))

    return NextResponse.json(formattedComments, { status: 200 })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect() // Ferme la connexion après chaque requête
  }
}
