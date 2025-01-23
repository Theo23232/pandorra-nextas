// api/user/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)

  const id = searchParams.get("id")
  const user = await prisma.user.findFirst({
    where: {
      id: id as string,
    },
  })
  return NextResponse.json(user, { status: 200 })
}
