import { NextRequest, NextResponse } from "next/server"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"

export async function GET(request: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const language = searchParams.get("language") || undefined
  const theme = searchParams.get("theme") || undefined
  const plan = searchParams.get("plan") || undefined
  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"
  const minJeton = Number.parseInt(searchParams.get("minJeton") || "0")

  const skip = (page - 1) * limit

  try {
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { firstname: { contains: search, mode: "insensitive" } },
            { lastname: { contains: search, mode: "insensitive" } },
            { fullname: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { stripeCustomerId: { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
          language: language,
          theme: theme,
          plan: plan as any,
          jeton: {
            gte: minJeton,
          },
        },
        select: {
          id: true,
          username: true,
          image: true,
          email: true,
          language: true,
          permissions: true,
          plan: true,
          jeton: true,
          createdAt: true,
          amountAccumulated: true,
          currentAmount: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.user.count({
        where: {
          OR: [
            { firstname: { contains: search, mode: "insensitive" } },
            { lastname: { contains: search, mode: "insensitive" } },
            { fullname: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { stripeCustomerId: { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
          language: language,
          theme: theme,
          plan: plan as any,
          jeton: {
            gte: minJeton,
          },
        },
      }),
    ])

    return NextResponse.json(
      {
        users,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
