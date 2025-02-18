"use server"

import { trackUserActivity } from "@/actions/user.ations"
import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"
import { GenerationWithImages } from "@/types/pandorra"

export const getUserGeneration = async (): Promise<GenerationWithImages[]> => {
  await trackUserActivity("getUserGeneration")

  const user = await currentUser()
  if (user) {
    return prisma.generation.findMany({
      where: { userId: user.id },
      include: {
        generated_images: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    })
  } else throw new Error("You are not authenticated")
}

export const deleteGeneration = async (id: string) => {
  await trackUserActivity("getUserGeneration")

  const user = await currentUser()
  if (user) {
    await prisma.generation
      .delete({
        where: {
          id,
        },
      })
      .catch((e) => {
        throw new Error(e)
      })
  } else throw new Error("You are not authenticated")
}
