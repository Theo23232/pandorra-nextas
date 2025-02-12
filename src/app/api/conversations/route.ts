import { NextResponse } from 'next/server';

import { currentUser } from '@/lib/current-user';
import { prisma } from '@/prisma';

export async function GET() {
  try {
    const user = await currentUser()
    if (!user)
      return NextResponse.json(
        { error: "You are not authentified" },
        { status: 403 },
      )
    const conversations = await prisma.gptConversation.findMany({
      where: { userId: user.id },
      include: { messages: true },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(conversations)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json()
    const user = await currentUser()
    if (!user)
      return NextResponse.json(
        { error: "You are not authentified" },
        { status: 403 },
      )

    const conversation = await prisma.gptConversation.create({
      data: {
        title,
        userId: user.id,
      },
    })
    return NextResponse.json(conversation)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
