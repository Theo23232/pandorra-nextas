"use server"

import { trackUserActivity } from "@/actions/user.ations"
import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

// Fonction utilitaire pour obtenir l'utilisateur actuel et lancer une erreur si non authentifié
const getCurrentUser = async () => {
  const user = await currentUser()
  if (!user) throw new Error("User not authenticated")
  return user
}

export const getUserIdByEmail = async (email: string): Promise<string> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })
  if (user) {
    return user.id
  } else throw new Error("User not found")
}

// Fonction utilitaire pour mettre à jour les données de l'utilisateur
export const updateUser = async (data: object) => {
  const user = await getCurrentUser()

  await prisma.user.update({
    where: { id: user.id },
    data,
  })
}

// Fonction pour éditer l'image de l'utilisateur
export const EditImage = async (image: string) => {
  await trackUserActivity("EditImage")

  await updateUser({ image })
}

// Fonction pour supprimer l'image de l'utilisateur
export const DeleteImage = async (image: string) => {
  await trackUserActivity("DeleteImage")

  await updateUser({ image })
}
