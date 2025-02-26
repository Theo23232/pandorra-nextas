"use server"

import { randomBytes } from "crypto"

import { hashPassword } from "@/lib/auth"
import { sendResetEmail } from "@/lib/mail"
import { SA } from "@/lib/safe-ation"
import { prisma } from "@/prisma"

export const editUser = SA(
  async (
    user,
    firstname: string,
    lastname: string,
    username: string,
    description: string,
  ) => {
    // Check if the new username is different from the current one
    if (username !== user.username) {
      // Check if the new username is already taken
      const existingUser = await prisma.user.findUnique({
        where: { username },
      })
      if (existingUser) {
        throw new Error("Username already taken")
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { firstname, lastname, username, description },
    })
  },
)

export const editImage = SA(async (user, image: string) => {
  await trackUserActivity("editImage")
  await prisma.user.update({
    where: { id: user.id },
    data: { image },
  })
})

export const editTheme = SA(async (user, theme: string) => {
  await trackUserActivity("editTheme")
  await prisma.user.update({
    where: { id: user.id },
    data: { theme },
  })
})

export const editLangange = SA(async (user, language: string) => {
  await trackUserActivity("editLangange")

  await prisma.user.update({
    where: { id: user.id },
    data: { language },
  })
})

export const editNotificationPreference = SA(
  async (user, emailNotification: boolean, pushNotification: boolean) => {
    await trackUserActivity("editNotificationPreference")

    await prisma.user.update({
      where: { id: user.id },
      data: { emailNotification, pushNotification },
    })
  },
)

export const editPassword = SA(
  async (
    user,
    newPassword: string,
    currentPassword: string,
  ): Promise<boolean> => {
    await trackUserActivity("editPassword")

    const hashedCurrentPassword = await hashPassword(currentPassword)
    const hashedNewPassword = await hashPassword(newPassword)
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { password: true },
    })

    if (hashedCurrentPassword != userWithPassword!.password) {
      throw new Error("Wrong password")
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
      },
    })
    return true
  },
)

export const resetPassword = SA(
  async (_user, token: string, password: string): Promise<boolean> => {
    await trackUserActivity("resetPassword")

    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token },
    })

    if (!resetRequest || resetRequest.expires < new Date()) {
      throw new Error("Invalid or expired token")
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await hashPassword(password)
    await prisma.user.update({
      where: { email: resetRequest.email },
      data: { password: hashedPassword },
    })

    // Supprimer le token utilisé
    await prisma.passwordReset.delete({
      where: { token },
    })

    return true
  },
)

export const forgotPassword = async (email: string) => {
  // Vérifier si l'utilisateur existe
  await trackUserActivity("forgotPassword")

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new Error("If this address exists, an email has been sent.")
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
}

export const getUserIdByEmail = async (email: string): Promise<string> => {
  await trackUserActivity("getUserIdByEmail")

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })
  if (user) {
    return user.id
  } else throw new Error("User not found")
}

export const addReferreId = SA(
  async (user, referreId: string): Promise<null> => {
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        referreId: referreId,
      },
    })
    return null
  },
)

export const EditUserTourDone = SA(async (user, tourName: string) => {
  await prisma.user.update({
    where: { id: user.id },
    data: {
      tourOnboarding: {
        push: tourName,
      },
    },
  })
})

export const trackUserActivity = SA(async (user, action: string) => {
  await prisma.userActivity.create({
    data: {
      userId: user.id,
      action,
    },
  })
})
