import { NextResponse } from "next/server"

import { prisma } from "@/prisma"

export async function GET(
  request: Request,
  { params }: { params: { email: string } },
  res: NextResponse,
) {
  const { email } = params
  const user = await prisma.user.findFirst({
    where: {
      email: email as string,
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
