import { NextRequest, NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Récupérer les paramètres de pagination de l'URL
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "0", 10)
    const limit = parseInt(searchParams.get("limit") || "8", 10)

    // Calculer le nombre d'éléments à sauter
    const skip = page * limit

    // Récupérer les générations avec pagination
    const data = await prisma.generation.findMany({
      where: { userId: user.id },
      include: {
        generated_images: true,
      },
      orderBy: {
        createdAt: "desc", // Du plus récent au plus ancien
      },
      skip,
      take: limit,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching generations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
