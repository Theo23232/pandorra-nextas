import { NextRequest, NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export const GET = async (req: NextRequest) => {
  const user = await currentUser()
  try {
    if (!user) {
      return NextResponse.json(
        { error: "You are not authentified" },
        { status: 403 },
      )
    }
    const agents = await prisma.agent.findMany({
      where: { userId: user.id },
      include: {
        Conversation: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            Transcript: {
              orderBy: {
                createdAt: "asc",
              },
            },
            agent: {
              select: {
                id: true,
                language: true,
                voiceId: true,
              },
            },
          },
        },
      },
    })
    return NextResponse.json({ agents })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  } finally {
    console.info("") // Ferme la connexion après chaque requête
  }
}
