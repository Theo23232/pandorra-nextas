import { OAuth2Client } from 'google-auth-library';
import { NextResponse } from 'next/server';

import { generateToken } from '@/lib/auth';
import { getDeviceInfo } from '@/lib/device';
import { prisma } from '@/prisma';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
)

export async function POST(req: Request) {
  try {
    const { credential } = await req.json()

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    })

    if (!user) {
      // Generate a unique username from email
      const baseUsername = payload.email.split("@")[0]
      let username = baseUsername
      let counter = 1

      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${counter}`
        counter++
      }

      user = await prisma.user.create({
        data: {
          email: payload.email,
          language: payload.locale,
          username: username,
          isEmailVerified: true,
          password: "", // Empty password for Google users
          image:
            payload.picture ||
            `https://api.dicebear.com/9.x/bottts/svg?seed=${payload.email}`,
          fullname: payload.name,
          firstname: payload.given_name,
          lastname: payload.family_name,
        },
      })
    }

    // Create session
    const userAgent = req.headers.get("user-agent") || ""
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0"

    const deviceInfo = await getDeviceInfo(userAgent, ip)
    await prisma.session.create({
      data: {
        userId: user.id,
        authType: "google",
        ...deviceInfo,
      },
    })

    // Generate token
    const token = generateToken(user.id)

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        image: user.image,
        fullname: user.fullname,
      },
    })
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  } finally {
    console.info("") // Ferme la connexion après chaque requête
  }
}
