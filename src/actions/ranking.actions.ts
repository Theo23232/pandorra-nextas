"use server"
import { prisma } from "@/prisma"

type PopularUser = {
  id: string
  firstname: string | null
  lastname: string | null
  fullname: string | null
  image: string
  username: string
  email: string
  language: string
  description: string | null
  theme: string
  password: string
  createdAt: Date
  updatedAt: Date
  permissions: string[]
  isEmailVerified: boolean
  referreId: string | null
  emailNotification: boolean
  pushNotification: boolean
  jeton: number
  stripeCustomerId: string | null
  connectStripeId: string | null
  amountAccumulated: string
  currentAmount: string
  plan: string
  points: number // Points de l'utilisateur
}

export async function getPopularUsers(
  month: number,
  year: number,
): Promise<PopularUser[]> {
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
  })

  // Ajoutez les points pour chaque utilisateur
  const usersWithPoints = popularUsers.map((user) => {
    const publicationsCount = user._count.Publication
    const reactionsCount = user._count.Reaction
    const commentsCount = user._count.Comment

    const points = publicationsCount + reactionsCount + commentsCount

    return {
      ...user,
      points,
    }
  })

  // Triez les utilisateurs par points décroissants
  const sortedUsers = usersWithPoints.sort((a, b) => b.points - a.points)

  return sortedUsers
}
