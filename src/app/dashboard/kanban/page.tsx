"use client"

import { FilterIcon, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import useSWR from "swr"

import { AddKanbanColumn } from "@/components/kanban/add-kanban-column"
import { FilterDialog } from "@/components/kanban/filter-dialog"
import { KanbanColumn } from "@/components/kanban/kanban-column"
import { TaskDetailDialog } from "@/components/kanban/task-detail-dialog"
import { useFilters } from "@/components/kanban/use-filters"
import { useTaskData } from "@/components/kanban/use-task-data"
import { AdminTaskForm } from "@/components/task/admin-create-task"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useIsSidebar } from "@/hooks/use-is-sidebar"
import { fetcher } from "@/lib/utils"
import { TaskWithRelations } from "@/types/task"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"

export default function RoutePage() {
  const { data: TaskStatus = [], mutate: mutateTaskStatus } = useSWR<string[]>(
    "/api/admin/task/status/list",
    fetcher,
  )
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(
    null,
  )
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const { isSidebar } = useIsSidebar()
  const { tasks, filteredTasks, isLoading, fetchTasks, updateTaskStatus } =
    useTaskData()

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    resetFilters,
    applyFilters,
  } = useFilters()

  useEffect(() => {
    applyFilters(tasks)
  }, [tasks, applyFilters])

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === "COLUMN") {
      const newTaskStatus = Array.from(TaskStatus)
      const [reorderedItem] = newTaskStatus.splice(source.index, 1)
      newTaskStatus.splice(destination.index, 0, reorderedItem)

      mutateTaskStatus(newTaskStatus, false)

      try {
        await sortTaskStatus(draggableId, destination.index)
        mutateTaskStatus()
      } catch (error) {
        console.error("Error sorting task status:", error)
        mutateTaskStatus(TaskStatus, false)
      }
    } else {
      const newStatus = destination.droppableId
      updateTaskStatus(draggableId, newStatus)
    }
  }

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  const sortTaskStatus = async (status: string, newOrder: number) => {
    try {
      const response = await fetch("/api/admin/task/status/sort", {
        method: "POST",
        headers: {
          "Content-Type": "services/json",
        },
        body: JSON.stringify({ status, newOrder }),
      })

      if (!response.ok) {
        throw new Error("Failed to sort task status")
      }
    } catch (error) {
      console.error("Error sorting task status:", error)
      throw error
    }
  }

  return (
    <>
      <div className="container p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Task Kanban Board</h1>

          <div className="flex items-center gap-2">
            <AdminTaskForm>
              <Button>
                <Plus /> Add task
              </Button>
            </AdminTaskForm>
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />

            <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-10">
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <FilterDialog
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
                closeDialog={() => setShowFilterDialog(false)}
              />
            </Dialog>

            <Button onClick={fetchTasks}>Refresh</Button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="columns"
              direction="horizontal"
              type="COLUMN"
            >
              {(provided) => (
                <ScrollArea
                  className={`mx-auto ${
                    isSidebar ? "w-[calc(100vw-20rem)]" : "w-[calc(100vw-8rem)]"
                  }`}
                >
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex gap-4 pb-4 pt-8"
                  >
                    {TaskStatus.map((status, index) => (
                      <Draggable
                        key={status}
                        draggableId={status}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <KanbanColumn
                              status={status}
                              label={status}
                              tasks={getTasksByStatus(status)}
                              onTaskClick={setSelectedTask}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <AddKanbanColumn />
                  </div>
                  <ScrollBar orientation="horizontal" className="top-0" />
                </ScrollArea>
              )}
            </Droppable>
          </DragDropContext>
        )}

        <TaskDetailDialog
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      </div>
    </>
  )
}
