import { NextResponse } from "next/server"

import { videoVerifyTask } from "@/actions/runway.actions"
import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

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
    videos.forEach(async (video, index) => {
      if (video.status === "Pending") {
        await videoVerifyTask(video.taskId)
      }
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error generating video:", error)
    return NextResponse.json({ error: error }, { status: 500 })
  } finally {
    await prisma.$disconnect() // Ferme la connexion après chaque requête
  }
}
