import { NextResponse } from "next/server"

import { prisma } from "@/prisma"
import { User } from "@prisma/client"

type Pagination = {
  currentPage: number
  totalPages: number
  totalUsers: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type SearchResponse = {
  users: User[]
  pagination: Pagination
}
export const GET = async (request: Request) => {
  try {
    // Récupérer les paramètres de la requête
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10")
    const searchQuery = url.searchParams.get("search") || "" // Recherche par mots-clés
    const sortBy = url.searchParams.get("sortBy") || "createdAt"
    const sortOrder = url.searchParams.get("sortOrder") || "desc"
    const filters = {
      name: url.searchParams.get("name"),
      email: url.searchParams.get("email"),
      plan: url.searchParams.get("plan"),
      privilege: url.searchParams.get("privilege"),
      jeton: url.searchParams.get("jeton"),
    }

    // Appliquer les filtres et tri
    const whereClause: any = {}

    // Si un searchQuery est fourni, filtrer sur le nom ou l'email
    if (searchQuery) {
      whereClause.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
      ]
    }

    // Filtrage supplémentaire par paramètres individuels (nom, email, plan, etc.)
    if (filters.name) {
      whereClause.name = { contains: filters.name, mode: "insensitive" }
    }
    if (filters.email) {
      whereClause.email = { contains: filters.email, mode: "insensitive" }
    }

    // Filtrage du plan
    if (filters.plan) {
      if (filters.plan.toLowerCase() === "paid") {
        // Si le plan est 'premium', exclure les utilisateurs ayant le plan 'Free'
        whereClause.plan = { not: "Free" }
      } else if (filters.plan.toLowerCase() === "all") {
        // on ne fait rien
      } else {
        // Sinon, appliquer le filtre exact pour le plan
        whereClause.plan = filters.plan
      }
    }

    if (filters.privilege) {
      if (filters.privilege.toLowerCase() === "all") {
      } else {
        whereClause.plan = filters.plan
      }
    }

    // Filtrer par nombre de jetons
    if (filters.jeton) {
      const jetonValue = parseInt(filters.jeton)
      whereClause.jeton = jetonValue ? { gte: jetonValue } : { gte: 0 } // Filtrer les utilisateurs ayant un nombre de jetons spécifié
    }

    console.log("whereClause ===> ", whereClause)
    // Récupérer les utilisateurs filtrés et triés
    const users = await prisma.user.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder === "desc" ? "desc" : "asc", // Tri dynamique par champ
      },
    })

    // Récupérer le nombre total d'utilisateurs pour la pagination
    const totalUsers = await prisma.user.count({
      where: whereClause,
    })

    // Calculer la page suivante et précédente
    const totalPages = Math.ceil(totalUsers / pageSize)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage,
        hasPreviousPage,
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "An error occurred while fetching users" },
      { status: 500 },
    )
  }
}
