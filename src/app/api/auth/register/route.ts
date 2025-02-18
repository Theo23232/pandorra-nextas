import { NextRequest, NextResponse } from "next/server"

import { generateToken, hashPassword } from "@/lib/auth"
import { getDeviceInfo } from "@/lib/device"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/prisma"

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json()

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    const existingUserEmail = await prisma.user.findUnique({
      where: { email },
    })
    const existingUserUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUserEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      )
    }
    if (existingUserUsername) {
      return NextResponse.json(
        { error: "Username already in use" },
        { status: 400 },
      )
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must at least contains 6 caracters" },
        { status: 400 },
      )
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already in use" },
        { status: 400 },
      )
    }

    const hashedPassword = await hashPassword(password)
    const stripeCustomer = await stripe.customers.create({
      email,
      name: username ?? undefined,
    })

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        image: `https://api.dicebear.com/9.x/bottts/svg?seed=${email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,transparent`,
        stripeCustomerId: stripeCustomer.id,
      },
    })

    const userAgent = req.headers.get("user-agent") || ""
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0"

    const token = generateToken(user.id)
    const deviceInfo = await getDeviceInfo(userAgent, ip)
    await prisma.session.create({
      data: {
        userId: user.id,
        ...deviceInfo,
      },
    })
    return NextResponse.json({
      message: "Utilisateur créé",
      userId: user.id,
      token,
      user: { id: user.id, email: user.email },
    })
  } catch (error) {
    console.log("Error: ", error)
  } finally {
    console.info("") // Ferme la connexion après chaque requête
  }
}
