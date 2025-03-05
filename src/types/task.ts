// types/types.ts

import { TaskPriority, TaskType } from '@prisma/client';

export interface CreateTaskDto {
  type: TaskType
  title: string
  description: string
  priority: TaskPriority
}

export interface UpdateTaskDto {
  status?: string
  assignedTo?: string
}

export interface ModerateTaskDto {
  isHidden: boolean
  moderationReason?: string
}

export interface TaskFilters {
  type?: TaskType
  status?: string
  priority?: TaskPriority
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface TaskListResponse {
  tasks: TaskWithRelations[]
  total: number
  page: number
  limit: number
}

export interface TaskWithRelations {
  id: string
  type: TaskType
  title: string
  description: string
  priority: TaskPriority
  status: string
  isHidden: boolean
  moderationReason?: string | null
  isFromFeedback: boolean
  createdAt: Date | string
  updatedAt: Date | string
  moderatedAt?: Date | string | null
  assignedToId?: string | null
  userId: string
  moderatedBy?: string | null
  assignedTo?: {
    id: string
    username: string
    firstname?: string | null
    fullname?: string | null
    image: string
  } | null
  user: {
    id: string
    username: string
    firstname?: string | null
    fullname?: string | null
    image: string
  }
  moderator?: {
    id: string
    username: string
    image: string
    fullname?: string | null
  } | null
  comments: Array<{
    id: string
    content: string
    createdAt: Date | string
    user: {
      id: string
      username: string
      firstname?: string | null
      fullname?: string | null
      image: string
    }
  }>
  attachments: Attachment[]
}

// You might also need to update your Attachment interface if you haven't already
export interface Attachment {
  id: string
  url: string
  filename: string
  originalFilename: string
  mimetype: string
  size: string
  createdAt: Date | string
  taskId: string
}
