import { NextResponse } from "next/server"

import { videoVerifyTask } from "@/actions/runway.actions"
import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"
import { Video } from "@prisma/client"

export async function GET() {
  try {
    const user = await currentUser()

    if (!user)
      return NextResponse.json(
        { error: "You are not authentified" },
        { status: 403 },
      )

    const videos = await prisma.video.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    let response: Video[] = []
    videos.forEach(async (video, index) => {
      if (video.status === "Pending") {
        let v = await videoVerifyTask(video.taskId)
        response.push(v)
      } else {
        response.push(video)
      }
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error generating sound:", error)
    return NextResponse.json(
      { error: "Failed to generate sound" },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect() // Ferme la connexion après chaque requête
  }
}
