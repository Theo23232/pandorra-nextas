import { NextResponse } from "next/server"

import { getPopularUsers } from "@/actions/ranking.actions"
import { prisma } from "@/prisma"

export async function GET() {
  try {
    const today = new Date()
    const month = today.getMonth() + 1 // Les mois commencent à 0 en JS, donc on ajoute 1
    const year = today.getFullYear()
    const rankingDate = `${month}-${year}`

    // Vérifier si le classement pour le mois a déjà été généré
    const existingRanking = await prisma.rank.findFirst({
      where: {
        date: rankingDate,
      },
    })

    if (existingRanking) {
      return NextResponse.json(
        { error: "Ranking for this mouth already generated" },
        { status: 500 },
      )
    }

    // Obtenir les utilisateurs les plus populaires pour le mois
    const popularUsers = await getPopularUsers(month, year)

    // Générer et enregistrer le classement avec le rang
    const rankings = popularUsers.map((user, index) => ({
      userId: user.id,
      points: user.points,
      date: rankingDate,
      rank: index + 1,
    }))

    const ranking = await prisma.rank.createMany({
      data: rankings,
    })

    return NextResponse.json({ ranking })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect() // Ferme la connexion après chaque requête
  }
}
