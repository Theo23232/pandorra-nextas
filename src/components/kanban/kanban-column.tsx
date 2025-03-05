import type { TaskWithRelations } from "@/types/task"
import { Draggable, Droppable } from '@hello-pangea/dnd';

import { TaskCard } from './task-card';

import type React from "react"
interface KanbanColumnProps {
  status: string
  label: string
  tasks: TaskWithRelations[]
  onTaskClick: (task: TaskWithRelations) => void
  dragHandleProps?: any
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  label,
  tasks,
  onTaskClick,
  dragHandleProps,
}) => {
  return (
    <div className="flex h-full w-96 flex-col">
      <div
        className="ounded-t-lg mb-2 flex cursor-move items-center justify-between rounded border border-border bg-muted px-4 py-3"
        {...dragHandleProps}
      >
        <h2 className="text-lg font-semibold text-sidebar-foreground">
          {label}
        </h2>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {tasks.length}
        </span>
      </div>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[500px] flex-1 rounded bg-muted p-2"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2"
                  >
                    <TaskCard task={task} onClick={() => onTaskClick(task)} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
