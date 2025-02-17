import { NextResponse } from "next/server"

import { prisma } from "@/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const statType = searchParams.get("type")

  switch (statType) {
    case "total-users":
      const totalUsers = await prisma.user.count()
      return NextResponse.json({ total: totalUsers })

    case "total-subscriptions":
      const totalSubscriptions = await prisma.subscribe.count()
      return NextResponse.json({ total: totalSubscriptions })

    case "total-tokens-bought":
      const totalTokens = await prisma.buyToken.aggregate({
        _sum: { amount: true },
      })
      return NextResponse.json({ total: totalTokens._sum.amount || 0 })

    case "active-users":
      const activeUsers = await prisma.session.groupBy({
        by: ["userId"],
        _count: { userId: true },
        where: {
          lastActive: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Active in the last 30 days
          },
        },
      })
      return NextResponse.json({ total: activeUsers.length })

    case "recent-signups":
      const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, username: true, createdAt: true },
      })
      return NextResponse.json({ users: recentUsers })

    case "user-plans":
      const userPlans = await prisma.user.groupBy({
        by: ["plan"],
        _count: { plan: true },
      })
      return NextResponse.json({
        labels: userPlans.map((p) => p.plan),
        datasets: [
          {
            data: userPlans.map((p) => p._count.plan),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#FF6384",
              "#36A2EB",
            ],
          },
        ],
      })

    case "user-growth":
    case "subscription-growth":
      const isSubscription = statType === "subscription-growth"
      const data = await prisma.$queryRaw<{ month: Date; count: number }[]>`
        SELECT DATE_TRUNC('month', "${isSubscription ? "Subscribe" : "User"}"."createdAt") AS month,
               COUNT(*) AS count
        FROM "${isSubscription ? "Subscribe" : "User"}"
        GROUP BY month
        ORDER BY month
      `
      return NextResponse.json({
        labels: data.map((d) => d.month.toISOString().split("T")[0]),
        datasets: [
          {
            label: isSubscription ? "Subscriptions" : "Users",
            data: data.map((d: any) => d.count),
            fill: false,
            borderColor: isSubscription ? "#FF6384" : "#36A2EB",
            tension: 0.1,
          },
        ],
      })

    default:
      return NextResponse.json(
        { error: "Invalid statistic type" },
        { status: 400 },
      )
  }
}
