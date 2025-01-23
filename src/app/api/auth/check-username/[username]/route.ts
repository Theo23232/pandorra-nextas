import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")
  const user = await prisma.user.findFirst({
    where: {
      username: username as string,
    },
  })
  try {
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
