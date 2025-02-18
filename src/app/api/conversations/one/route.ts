// /api/conversations/one/route.ts
import { NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const user = await currentUser()
    if (!user)
      return NextResponse.json(
        { error: "You are not authentified" },
        { status: 403 },
      )
    const conversation = await prisma.gptConversation.findUnique({
      where: { id },
      include: { messages: true },
    })

    if (conversation?.userId !== user.id) {
      return NextResponse.json({ error: "Forbiden" }, { status: 403 })
    }
    return NextResponse.json(conversation)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  } finally {
    console.info("")
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const { content, role } = await req.json()
    const user = await currentUser()
    if (!user || !id) {
      return NextResponse.json({ error: "Bag request" }, { status: 403 })
    }

    const message = await prisma.message.create({
      data: {
        content,
        role,
        gptConversationId: id,
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  } finally {
    console.info("")
  }
}
