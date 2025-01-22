import { NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export const GET = async () => {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json(null, { status: 200 })
  }

  const variants = await prisma.variant.findMany({
    where: { userId: user.id },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      original: true,
      variant: true,
    },
  })

  return NextResponse.json(variants, { status: 200 })
}
