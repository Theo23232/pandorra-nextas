import { cookies } from "next/headers"

import { verifyToken } from "@/lib/auth"
import { prisma } from "@/prisma"

export async function currentUser() {
  const token = (await cookies()).get("auth-token")?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    omit: {
      password: true,
    },
  })

  return user
}
