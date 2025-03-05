"use server"

import { trackUserActivity } from '@/actions/user.ations';
import { myCache } from '@/cache';
import { currentUser } from '@/lib/current-user';
import { SA } from '@/lib/safe-ation';
import { prisma } from '@/prisma';
import { GenerationWithImages } from '@/types/pandorra';

export const getUserGeneration = async (): Promise<GenerationWithImages[]> => {
  await trackUserActivity("getUserGeneration")

  const user = await currentUser()
  if (user) {
    const cacheKey = `user:generation:${user.id}`
    const cachedResult = myCache.get(cacheKey)
    if (cachedResult) return cachedResult as GenerationWithImages[]

    const data = prisma.generation.findMany({
      where: { userId: user.id },
      include: {
        generated_images: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    })
    myCache.set(cacheKey, data, 3600)
    return data
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

export const deleteImage = SA(async (user, imageUrl: string): Promise<null> => {
  await prisma.generatedImage.deleteMany({
    where: {
      url: imageUrl,
    },
  })
  await prisma.userImage.deleteMany({
    where: {
      imageUrl: imageUrl,
    },
  })
  return null
})
