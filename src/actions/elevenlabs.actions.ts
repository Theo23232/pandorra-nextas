"use server"
import { SA } from "@/lib/safe-ation"
import { prisma } from "@/prisma"

export const generateFX = SA(
  async (user, prompt: string, url: string): Promise<any> => {
    await prisma.fX.create({
      data: {
        userId: user.id,
        prompt,
        url,
      },
    })
  },
)
