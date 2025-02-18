import { NextResponse } from "next/server"

import { prisma } from "@/prisma"

export async function GET(request: Request) {
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            Generation: true,
            Publication: true,
            Conversation: true,
            Video: true,
          },
        },
      },
    })
    console.log("user ==> ", user)
    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error }, { status: 500 })
  } finally {
    console.info("") // Ferme la connexion après chaque requête
  }
}
