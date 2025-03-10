"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

import { updateTask } from "@/actions/task.actions"
import { Textarea } from "@/components/ui/textarea"

interface TaskDescriptionEditorProps {
  taskId: string
  initialDescription: string
}

export const TaskDescriptionEditor: React.FC<TaskDescriptionEditorProps> = ({
  taskId,
  initialDescription,
}) => {
  const [description, setDescription] = useState(initialDescription)
  const [isEditing, setIsEditing] = useState(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value)

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    updateTimeoutRef.current = setTimeout(() => {
      updateTask(taskId, { description: e.target.value })
    }, 2000)
  }

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)

    if (description !== initialDescription) {
      updateTask(taskId, { description })
    }
  }

  return (
    <div className="w-full">
      {isEditing ? (
        <Textarea
          value={description}
          onChange={handleDescriptionChange}
          onBlur={handleBlur}
          className="min-h-[100px] focus:ring-0"
          placeholder="Add a description..."
          autoFocus
        />
      ) : (
        <div
          onClick={handleClick}
          className="min-h-[100px] cursor-text rounded-md border border-transparent p-2 hover:border-gray-200"
        >
          {description || (
            <span className="text-gray-400">Add a description...</span>
          )}
        </div>
      )}
    </div>
  )
}
