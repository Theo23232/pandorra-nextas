// api/user/[username]/route.ts

import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/prisma"

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username as string,
      },
    })
    if (user) {
      return NextResponse.json(false, { status: 200 })
    } else {
      return NextResponse.json(true, { status: 200 })
    }
  } catch (err) {
    return NextResponse.json({ status: 500 })
  } finally {
    console.info("") // Ferme la connexion après chaque requête
  }
}
