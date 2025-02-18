import { NextRequest, NextResponse } from "next/server"

import { getDashboardStats } from "@/actions/stats.action"

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const stats = await getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
