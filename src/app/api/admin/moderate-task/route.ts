// app/api/admin/moderate-task/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { currentUser } from '@/lib/current-user';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function PUT(req: NextRequest) {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, isHidden, moderationReason } = await req.json()
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        isHidden,
        moderationReason,
        moderatedAt: new Date(),
        moderatedBy: user.id,
      },
    })
    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json(
      { error: "Error moderating task" },
      { status: 500 },
    )
  }
}
