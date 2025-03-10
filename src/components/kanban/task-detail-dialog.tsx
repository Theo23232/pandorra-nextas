"use client"

import { useEffect, useRef, useState } from "react"

import { updateTask } from "@/actions/task.actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { TaskPriority } from "@prisma/client"

import { priorityColors, typeColors } from "./constants"

import type { TaskWithRelations } from "@/types/task"
import type React from "react"
interface TaskDetailDialogProps {
  task: TaskWithRelations | null
  onClose: () => void
}

export const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  task,
  onClose,
}) => {
  // Initialize state with default values to avoid conditional hook calls
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority || "LOW",
  )

  // Refs for timeout management
  const titleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const descriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Refs for input elements
  const titleInputRef = useRef<HTMLInputElement>(null)
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
    }
  }, [task])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current)
      if (descriptionTimeoutRef.current)
        clearTimeout(descriptionTimeoutRef.current)
    }
  }, [])

  // Title editing handlers
  const handleTitleClick = () => {
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

    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current)
    }

    titleTimeoutRef.current = setTimeout(() => {
      updateTask(task?.id!, { title: e.target.value })
    }, 2000)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
    if (title !== task?.title) {
      updateTask(task?.id!, { title })
    }
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false)
      if (title !== task?.title) {
        updateTask(task?.id!, { title })
      }
    }
  }

  // Description editing handlers
  const handleDescriptionClick = () => {
    setIsEditingDescription(true)
    // Focus the textarea after rendering
    setTimeout(() => {
      if (descriptionTextareaRef.current) {
        descriptionTextareaRef.current.focus()
      }
    }, 0)
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value)

    if (descriptionTimeoutRef.current) {
      clearTimeout(descriptionTimeoutRef.current)
    }

    descriptionTimeoutRef.current = setTimeout(() => {
      updateTask(task?.id!, { description: e.target.value })
    }, 2000)
  }

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false)
    if (description !== task?.description) {
      updateTask(task?.id!, { description })
    }
  }

  // Priority change handler
  const handlePriorityChange = (newPriority: TaskPriority) => {
    setPriority(newPriority)
    updateTask(task?.id!, { priority: newPriority })
  }

  if (!task) return null

  return (
    <Dialog open={!!task} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div
            className="flex cursor-text items-center gap-2 text-xl"
            onClick={handleTitleClick}
          >
            <Badge className={typeColors[task.type]}>{task.type}</Badge>

            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                className="w-full border-none bg-transparent p-0 text-xl font-semibold outline-none focus:ring-0"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
              />
            ) : (
              <span>{title}</span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={task.user.image} alt={task.user.username} />
                <AvatarFallback>
                  {task.user.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {task.user.fullname || task.user.username}
                </div>
                <div className="text-sm text-slate-500">
                  @{task.user.username}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-500">Created on</div>
              <div>{new Date(task.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Badge
                  variant="outline"
                  className="flex cursor-pointer items-center gap-1 hover:bg-muted"
                >
                  Priority:{" "}
                  <span
                    className={`h-2 w-2 rounded-full ${priorityColors[priority]}`}
                  ></span>{" "}
                  {priority}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handlePriorityChange("LOW")}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${priorityColors.LOW}`}
                    ></span>
                    <span>LOW</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePriorityChange("MEDIUM")}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${priorityColors.MEDIUM}`}
                    ></span>
                    <span>MEDIUM</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePriorityChange("HIGH")}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${priorityColors.HIGH}`}
                    ></span>
                    <span>HIGH</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Badge variant="outline">Status: {task.status}</Badge>

            {task.isHidden && <Badge variant="destructive">Hidden</Badge>}
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium">Description</h4>
            {isEditingDescription ? (
              <Textarea
                ref={descriptionTextareaRef}
                className="min-h-[100px] w-full focus:ring-0"
                value={description}
                onChange={handleDescriptionChange}
                onBlur={handleDescriptionBlur}
              />
            ) : (
              <p
                className="cursor-text whitespace-pre-line"
                onClick={handleDescriptionClick}
              >
                {description || (
                  <span className="italic text-slate-400">
                    No description provided. Click to add one.
                  </span>
                )}
              </p>
            )}
          </div>

          {task.attachments && task.attachments.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium">Attachments</h4>
              <div className="flex flex-wrap gap-2">
                {task.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded bg-slate-100 p-2 text-sm hover:bg-slate-200"
                  >
                    <span>{attachment.filename}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {task.isHidden && task.moderator && (
            <div className="rounded-lg bg-red-50 p-4">
              <h4 className="mb-2 font-medium text-red-800">Moderation</h4>
              <div className="mb-2 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={task.moderator.image}
                    alt={task.moderator.username}
                  />
                  <AvatarFallback>
                    {task.moderator.username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  Moderated by @{task.moderator.username}
                </span>
              </div>
              <p className="text-sm text-red-700">{task.moderationReason}</p>
            </div>
          )}

          {task.comments && task.comments.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium">
                Comments ({task.comments.length})
              </h4>
              <div className="space-y-3">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg bg-slate-50 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={comment.user.image}
                          alt={comment.user.username}
                        />
                        <AvatarFallback>
                          {comment.user.username.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        @{comment.user.username}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="pl-8 text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
