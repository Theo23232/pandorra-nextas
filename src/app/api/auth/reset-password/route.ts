import { NextResponse } from "next/server"

import { resetPassword } from "@/actions/user.ations"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    await resetPassword(token, password)

    return NextResponse.json({
      message: "Password up to date",
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
