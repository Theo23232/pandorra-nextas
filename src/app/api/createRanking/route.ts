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
    const existingRanking = await prisma.ranking.findFirst({
      where: {
        date: rankingDate,
      },
    })

    if (existingRanking) {
      console.log(`Le classement pour ${rankingDate} a déjà été généré.`)
      return
    }

    // Obtenir les utilisateurs les plus populaires pour le mois
    const popularUsers = await getPopularUsers(month, year)

    // Générer et enregistrer le classement avec le rang
    const rankings = popularUsers.map((user, index) => ({
      userId: user.id,
      points: user.points,
      date: rankingDate,
      rank: index + 1, // Ajouter le rang de l'utilisateur
    }))

    const ranking = await prisma.ranking.createMany({
      data: rankings,
    })

    console.log(`Le classement pour ${rankingDate} a été généré avec succès.`)
    return NextResponse.json({ ranking })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
