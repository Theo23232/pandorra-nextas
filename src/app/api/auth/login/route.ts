import { NextResponse } from 'next/server';

import { generateToken, verifyPassword } from '@/lib/auth';
import { getDeviceInfo } from '@/lib/device';
import { prisma } from '@/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const userAgent = req.headers.get("user-agent") || ""
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0"
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 400 },
      )
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 400 },
      )
    }

    const token = generateToken(user.id)
    const deviceInfo = await getDeviceInfo(userAgent, ip)
    await prisma.session.create({
      data: {
        userId: user.id,
        ...deviceInfo,
      },
    })

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email },
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
