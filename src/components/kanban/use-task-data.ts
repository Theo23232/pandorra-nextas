import { useCallback, useEffect, useState } from 'react';

import { TaskWithRelations } from '@/types/task';

export const useTaskData = () => {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/task?limit=1000");
      const data = await response.json();
      setTasks(data.tasks);
      setFilteredTasks(data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateTaskStatus = async (id: string, newStatus: string) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      );

      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);

      const response = await fetch("/api/admin/task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      fetchTasks(); // Refresh data on error
    }
  };

  return {
    tasks,
    filteredTasks,
    setFilteredTasks,
    isLoading,
    fetchTasks,
    updateTaskStatus,
  };
};
