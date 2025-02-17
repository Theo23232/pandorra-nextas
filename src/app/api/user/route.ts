import { NextResponse } from "next/server"

import { prisma } from "@/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
      plan: true,
      jeton: true,
    },
  })

  return NextResponse.json({ users })
}
