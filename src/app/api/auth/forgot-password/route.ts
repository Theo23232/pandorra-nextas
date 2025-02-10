import { randomBytes } from "crypto"
import { NextResponse } from "next/server"

import { sendResetEmail } from "@/lib/mail"
import { prisma } from "@/prisma"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({
        message: "If this address exists, an email has been sent.",
      })
    }

    // Générer un token unique
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 heure

    // Supprimer les anciens tokens
    await prisma.passwordReset.deleteMany({
      where: { email },
    })

    // Créer un nouveau token
    await prisma.passwordReset.create({
      data: {
        email,
        token,
        expires,
      },
    })

    // Envoyer l'email
    await sendResetEmail(email, token)

    return NextResponse.json({
      message: "If this address exists, an email has been sent.",
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  } finally {
    await prisma.$disconnect() // Ferme la connexion après chaque requête
  }
}
