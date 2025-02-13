// /api/publication/all

"use server"

import { NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const model = searchParams.get("model")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 20

  const user = await currentUser()
  if (!user) throw new Error("You are not connected")

  try {
    const publications = await prisma.publication.findMany({
      where: {
        ...(model && model !== "all" ? { model } : {}),
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
      skip: (page - 1) * limit,
      take: limit,
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
  }
}
