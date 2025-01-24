"use server"

import { NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export const GET = async (request: Request) => {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json(
      { error: "You are not connected" },
      { status: 401 },
    )
  }

  try {
    const url = new URL(request.url)
    const modelName = url.searchParams.get("modelName")
    const page = parseInt(url.searchParams.get("page") || "1", 10)
    const limit = parseInt(url.searchParams.get("limit") || "10", 10)

    if (page <= 0 || limit <= 0) {
      return NextResponse.json(
        { error: "Page and limit must be positive integers" },
        { status: 400 },
      )
    }

    const skip = (page - 1) * limit

    // Requête avec pagination
    const publications = await prisma.publication.findMany({
      where: {
        model: modelName || "",
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
      skip, // Ignorer les éléments précédents
      take: limit, // Limiter le nombre de résultats
    })

    const totalPublications = await prisma.publication.count()

    const response = publications.map((publication) => ({
      ...publication,
      isLiked: publication.reaction.some(
        (reaction) => reaction.userId === user.id,
      ),
      reactionsCount: publication.reaction.length,
      commentCount: publication.comment.length,
    }))

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("Error fetching publications:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
