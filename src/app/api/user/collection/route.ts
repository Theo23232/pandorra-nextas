import { NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"
import { UserImage } from "@prisma/client"

export const GET = async () => {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json(null, { status: 200 })
  }
  try {
    const collections: UserImage[] = await prisma.userImage.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(collections, { status: 200 })
  } catch (error) {
    return NextResponse.json({ status: 500 })
  } finally {
    await prisma.$disconnect() // Ferme la connexion après chaque requête
  }
}
