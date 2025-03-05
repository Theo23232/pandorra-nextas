// app/api/admin/task/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { getTasks } from '@/actions/task.actions';
import { currentUser } from '@/lib/current-user';
import { prisma } from '@/prisma';
import { TaskWithRelations } from '@/types/task';
import { TaskPriority, TaskType } from '@prisma/client';

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get query parameters
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = parseInt(url.searchParams.get("limit") || "10")
  const searchQuery = url.searchParams.get("search") || ""
  const types = url.searchParams.getAll("type")
  const priorities = url.searchParams.getAll("priority")
  const statuses = url.searchParams.getAll("status")
  const sortBy = url.searchParams.get("sortBy") || "createdAt"
  const sortDirection =
    (url.searchParams.get("sortDirection") as "asc" | "desc") || "desc"
  const isHidden = url.searchParams.get("isHidden")
  const startDate = url.searchParams.get("startDate")
  const endDate = url.searchParams.get("endDate")

  try {
    // Build the filter object
    const where: any = {}

    // Search query (across multiple fields)
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        { id: { contains: searchQuery, mode: "insensitive" } },
        {
          user: {
            OR: [
              { username: { contains: searchQuery, mode: "insensitive" } },
              { fullname: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
        },
      ]
    }

    // Filter by type
    if (types.length > 0) {
      where.type = { in: types as TaskType[] }
    }

    // Filter by priority
    if (priorities.length > 0) {
      where.priority = { in: priorities as TaskPriority[] }
    }

    // Filter by status
    if (statuses.length > 0) {
      where.status = { in: statuses }
    }

    // Filter by hidden status
    if (isHidden !== null && isHidden !== undefined) {
      where.isHidden = isHidden === "true"
    }

    // Filter by date range
    if (startDate) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(startDate),
      }
    }

    if (endDate) {
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(endDate),
      }
    }

    // Get total count for pagination
    const totalCount = await prisma.task.count({ where })
    const tasks: TaskWithRelations[] = await getTasks(
      page,
      limit,
      sortBy,
      sortDirection,
      where,
    )

    // Return both the data and pagination info
    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, status, assignedTo } = await req.json()
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status, assignedTo },
    })
    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json({ error: "Error updating task" }, { status: 500 })
  }
}

// Implement moderation endpoint
export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, isHidden, moderationReason } = await req.json()

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        isHidden,
        moderationReason,
        moderatedAt: new Date(),
        moderatedBy: user.id,
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json(
      { error: "Error moderating task" },
      { status: 500 },
    )
  }
}
