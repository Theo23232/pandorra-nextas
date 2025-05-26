import { NextResponse } from 'next/server';

import { getVideoGenerations } from '@/actions/kling.actions';
import { currentUser } from '@/lib/current-user';

export async function GET() {
  try {
    const user = await currentUser()

    if (!user)
      return NextResponse.json(
        { error: "You are not authentified" },
        { status: 403 },
      )

    const videos = await getVideoGenerations()

    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error generating video:", error)
    return NextResponse.json({ error: error }, { status: 500 })
  } finally {
    console.info("") // Ferme la connexion après chaque requête
  }
}
