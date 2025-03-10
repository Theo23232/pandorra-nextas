"use client"

import { useCallback } from "react"
import useSWR, { mutate } from "swr"

import type { TaskWithRelations } from "@/types/task"

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const useTaskData = () => {
  // Use SWR for data fetching with automatic revalidation
  const { data, error, isLoading } = useSWR(
    "/api/admin/task?limit=1000",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  )

  // Derived state
  const tasks = data?.tasks || []
  const filteredTasks = data?.tasks || []

  // Manual fetch function (can be used to force refresh)
  const fetchTasks = useCallback(() => {
    return mutate("/api/admin/task?limit=1000")
  }, [])

  const updateTaskStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      const optimisticData = {
        ...data,
        tasks: tasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task,
        ),
      }

      // Use mutate for optimistic updates
      mutate("/api/admin/task?limit=1000", optimisticData, false)

      // Make the actual API request
      const response = await fetch("/api/admin/task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task status")
      }

      // Revalidate after successful update
      mutate("/api/admin/task?limit=1000")
    } catch (error) {
      console.error("Error updating task status:", error)
      // Revalidate on error to get the correct state
      mutate("/api/admin/task?limit=1000")
    }
  }

  // For filtered tasks functionality
  const setFilteredTasks = useCallback((filteredData: TaskWithRelations[]) => {
    // This is a local filter that doesn't affect the SWR cache
    // We're maintaining the same API as before
    return filteredData
  }, [])

  return {
    tasks,
    filteredTasks,
    setFilteredTasks,
    isLoading,
    fetchTasks,
    updateTaskStatus,
    error,
  }
}
