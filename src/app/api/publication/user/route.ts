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
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json(
      { error: "Publication ID is required" },
      { status: 400 },
    )
  }

  try {
    const publications = await prisma.publication.findMany({
      where: {
        userId: userId,
      },
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
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  } finally {
    console.info("") // Ferme la connexion après chaque requête
  }
}
