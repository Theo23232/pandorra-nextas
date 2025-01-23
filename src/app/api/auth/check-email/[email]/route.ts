import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")
  const user = await prisma.user.findFirst({
    where: {
      email: email as string,
    },
  })
  try {
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
