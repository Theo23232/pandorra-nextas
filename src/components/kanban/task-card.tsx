"use client"

import { useEffect, useRef, useState } from "react"

import { updateTask } from "@/actions/task.actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TaskPriority } from "@prisma/client"

import { priorityColors, typeColors } from "./constants"

import type { TaskWithRelations } from "@/types/task"
import type React from "react"
interface TaskCardProps {
  task: TaskWithRelations
  onClick: () => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const titleUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle title changes with debounce
  useEffect(() => {
    if (title !== task.title && !isEditingTitle) {
      if (titleUpdateTimeoutRef.current) {
        clearTimeout(titleUpdateTimeoutRef.current)
      }

      updateTask(task.id, { title })
    }
  }, [title, isEditingTitle, task.id, task.title])

  // Handle title edit
  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingTitle(true)
    // Focus the input after rendering
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus()
      }
    }, 0)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)

    if (titleUpdateTimeoutRef.current) {
      clearTimeout(titleUpdateTimeoutRef.current)
    }

    titleUpdateTimeoutRef.current = setTimeout(() => {
      if (title !== task.title) {
        updateTask(task.id, { title })
      }
    }, 2000)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false)
      if (title !== task.title) {
        updateTask(task.id, { title })
      }
    }
  }

  // Handle priority change
  const handlePriorityChange = (newPriority: TaskPriority) => {
    setPriority(newPriority)
    updateTask(task.id, { priority: newPriority })
  }

  // Prevent card click when interacting with editable elements
  const handleEditableClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card
      className={`w-full overflow-hidden ${task.isHidden ? "opacity-50" : ""}`}
      onClick={onClick}
    >
      <CardContent className="cursor-pointer p-3">
        <div className="mb-2 flex items-start justify-between">
          <Badge className={typeColors[task.type]}>{task.type}</Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleEditableClick}>
              <div
                className={`h-3 w-3 rounded-full ${priorityColors[priority]} cursor-pointer hover:ring-2 hover:ring-gray-200 hover:ring-offset-2`}
                title={priority}
              ></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePriorityChange("LOW")}>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${priorityColors.LOW}`}
                  ></div>
                  <span>Low</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange("MEDIUM")}>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${priorityColors.MEDIUM}`}
                  ></div>
                  <span>Medium</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange("HIGH")}>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${priorityColors.HIGH}`}
                  ></div>
                  <span>High</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            className="mb-2 w-full border-none bg-transparent p-0 font-medium outline-none focus:ring-0"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            onClick={handleEditableClick}
          />
        ) : (
          <h3
            className="mb-2 line-clamp-2 w-[320px] cursor-text font-medium"
            onClick={handleTitleClick}
          >
            {title}
          </h3>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={task.user.image} alt={task.user.username} />
              <AvatarFallback>{task.user.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span>{task.user.username}</span>
          </div>
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
