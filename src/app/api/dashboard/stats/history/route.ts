import { NextRequest, NextResponse } from "next/server"

// app/api/stats/history/route.ts
import {
  getActiveUsersHistory,
  getRevenueHistory,
  getSignupsHistory,
  getSubscriptionsHistory,
} from "@/actions/stats.action"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get("type")
    const period = searchParams.get("period") as "week" | "month" | "quarter"

    if (!type || !period) {
      return NextResponse.json(
        { error: "Missing type or period parameter" },
        { status: 400 },
      )
    }

    let data
    switch (type) {
      case "revenue":
        data = await getRevenueHistory(period)
        break
      case "subscriptions":
        data = await getSubscriptionsHistory(period)
        break
      case "signups":
        data = await getSignupsHistory(period)
        break
      case "active-users":
        data = await getActiveUsersHistory(period)
        break
      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 },
        )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
