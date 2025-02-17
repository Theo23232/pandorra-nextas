"use server"

import { SA } from "@/lib/safe-ation"
import { prisma } from "@/prisma"

export const verifyCredit = SA(
  async (user, credit: number): Promise<Boolean> => {
    if (user.jeton < credit) return false
    return true
  },
)
export const reduceCredit = SA(async (user, credit: number) => {
  let creditRemain = user.jeton - credit

  if (creditRemain < 0) creditRemain = 0
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      jeton: creditRemain,
    },
  })
})
