// api/conversations/route.ts
import { NextResponse } from "next/server"
import { OpenAI } from "openai"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

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
    return NextResponse.json({ error: error }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(req: Request) {
  try {
    const { firstPrompt } = await req.json()
    const user = await currentUser()
    if (!user)
      return NextResponse.json(
        { error: "You are not authentified" },
        { status: 403 },
      )

    const titleGenerate = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Generate a conversation title based on thsi first prompt. Directly give the title without anything else. And don't add quotes or double quotes. Give a title that fit in maximum 20 chars. Choose a title that correspond to the langage of the prompt, if unknown langage use english",
        },
        { role: "user", content: firstPrompt },
      ],
    })
    const title = titleGenerate.choices[0].message.content ?? firstPrompt

    const conversation = await prisma.gptConversation.create({
      data: {
        title,
        userId: user.id,
      },
    })
    return NextResponse.json(conversation)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
