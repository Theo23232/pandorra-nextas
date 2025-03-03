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
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    const audios = await prisma.voiceChange.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: twentyFourHoursAgo, // Filtrer les enregistrements de moins de 24h
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(audios)
  } catch (error) {
    console.error("Error generating sound:", error)
    return NextResponse.json(
      { error: "Failed to generate sound" },
      { status: 500 },
    )
  } finally {
    console.info("") // Ferme la connexion après chaque requête
  }
}
