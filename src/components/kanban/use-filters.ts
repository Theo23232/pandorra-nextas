"use client";

import { useState } from 'react';

import { TaskPriority, TaskType } from '@prisma/client';

import type { TaskWithRelations } from "@/types/task";
export const useFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    types: [] as TaskType[],
    priorities: [] as TaskPriority[],
    isHidden: null as boolean | null,
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      types: [],
      priorities: [],
      isHidden: null,
      startDate: null,
      endDate: null,
    });
  };

  const applyFilters = (tasks: TaskWithRelations[]) => {
    let result = [...tasks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.user.username.toLowerCase().includes(query) ||
          (task.user.fullname &&
            task.user.fullname.toLowerCase().includes(query))
      );
    }

    if (filters.types.length > 0) {
      result = result.filter((task) => filters.types.includes(task.type));
    }

    if (filters.priorities.length > 0) {
      result = result.filter((task) =>
        filters.priorities.includes(task.priority)
      );
    }

    if (filters.isHidden !== null) {
      result = result.filter((task) => task.isHidden === filters.isHidden);
    }

    if (filters.startDate) {
      result = result.filter(
        (task) => new Date(task.createdAt) >= filters.startDate!
      );
    }

    if (filters.endDate) {
      const endDateTime = new Date(filters.endDate);
      endDateTime.setHours(23, 59, 59, 999);
      result = result.filter((task) => new Date(task.createdAt) <= endDateTime);
    }

    return result;
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    resetFilters,
    applyFilters,
  };
};
