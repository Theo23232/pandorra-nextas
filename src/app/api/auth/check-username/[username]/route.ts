import { NextResponse } from "next/server"

import { prisma } from "@/prisma"

export async function GET(
  request: Request,
  { params }: { params: { username: string } },
  res: NextResponse,
) {
  const { username } = params
  const user = await prisma.user.findFirst({
    where: {
      username: username as string,
    },
  })
  try {
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
