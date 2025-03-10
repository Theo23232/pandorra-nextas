import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import { priorityColors, typeColors } from "./constants"

import type React from "react"

import type { TaskWithRelations } from "@/types/task"
interface TaskCardProps {
  task: TaskWithRelations
  onClick: () => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <Card
      className={`w-full overflow-hidden ${task.isHidden ? "opacity-50" : ""}`}
      onClick={onClick}
    >
      <CardContent className="cursor-pointer p-3">
        <div className="mb-2 flex items-start justify-between">
          <Badge className={typeColors[task.type]}>{task.type}</Badge>
          <div
            className={`h-3 w-3 rounded-full ${priorityColors[task.priority]}`}
            title={task.priority}
          ></div>
        </div>

        <h3 className="mb-2 line-clamp-2 w-[320px] font-medium">
          {task.title}
        </h3>

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
