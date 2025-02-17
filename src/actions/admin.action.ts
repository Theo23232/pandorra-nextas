"use server"

import { prisma } from "@/prisma"

export async function updateUserPlan(userId: string, plan: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { plan: plan as any },
  })
}

export async function addUserTokens(userId: string, tokens: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { jeton: { increment: tokens } },
  })
}
