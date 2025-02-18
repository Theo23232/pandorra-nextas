import { NextResponse } from "next/server"

import { prisma } from "@/prisma"

export interface UserStats {
  monthlyStats: {
    date: string
    userCount: number
  }[]
  newUsersPercentage: number
}

export const GET = async () => {
  try {
    const monthlyStats = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        },
      },
    })

    const currentMonthStart = new Date()
    currentMonthStart.setDate(1)
    currentMonthStart.setHours(0, 0, 0, 0)

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
        },
      },
    })
    let dates = monthlyStats.map(
      (stat) => stat.createdAt.toISOString().split("T")[0],
    )
    const occurrences = dates.reduce((acc, date) => {
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    // Transformer en tableau d'objets
    const result = Object.entries(occurrences).map(([date, userCount]) => ({
      date,
      userCount,
    }))

    const totalUsers = await prisma.user.count()
    const newUsersPercentage = (newUsersThisMonth / totalUsers) * 100
    const formattedStats = {
      monthlyStats: result,
      newUsersPercentage,
    }

    return NextResponse.json(formattedStats, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 },
    )
  }
}
