import { NextResponse } from 'next/server';

import { currentUser } from '@/lib/current-user';
import { pusherServer } from '@/pusher';

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const data = await req.text()
    const { socket_id, channel_name } = Object.fromEntries(
      new URLSearchParams(data),
    )

    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name)

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error("Pusher auth error:", error)
    return NextResponse.json(
      { error: "Erreur d'authentification" },
      { status: 500 },
    )
  }
}
