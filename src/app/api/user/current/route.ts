import { NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { User } from "@/types/next"

export const GET = async () => {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json(null, { status: 200 })
  } else {
    const response: User = user
    return NextResponse.json(response, { status: 200 })
  }
}
