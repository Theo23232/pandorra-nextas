import { NextRequest, NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  return NextResponse.json(user)
}
