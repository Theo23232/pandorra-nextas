"use server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"
import { GenerationWithImages } from "@/types/pandorra"

export const getUserGeneration = async (): Promise<GenerationWithImages[]> => {
  const user = await currentUser()
  if (user) {
    return prisma.generation.findMany({
      where: { userId: user.id },
      include: {
        generated_images: true,
      },
    })
  } else throw new Error("You are not authenticated")
}

export const deleteGeneration = async (id: string) => {
  await prisma.generation
    .delete({
      where: {
        id,
      },
    })
    .catch((e) => {
      throw new Error(e)
    })
}
