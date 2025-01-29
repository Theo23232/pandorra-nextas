"use server"
import { prisma } from "@/prisma"

export async function getPopularUsers(month: number, year: number) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const popularUsers = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          Publication: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          Reaction: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          Comment: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      },
    },
    orderBy: [
      {
        Publication: {
          _count: "desc",
        },
      },
      {
        Reaction: {
          _count: "desc",
        },
      },
      {
        Comment: {
          _count: "desc",
        },
      },
    ],
  })

  return popularUsers
}
