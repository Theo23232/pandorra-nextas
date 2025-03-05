import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { TaskPriority, TaskType } from '@prisma/client';

import type React from "react";

interface FilterDialogProps {
  filters: {
    types: TaskType[];
    priorities: TaskPriority[];
    isHidden: boolean | null;
    startDate: Date | null;
    endDate: Date | null;
  };
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  closeDialog: () => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  filters,
  setFilters,
  resetFilters,
  closeDialog,
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Filter Tasks</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Task Type</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(TaskType).map((type) => (
              <Badge
                key={type}
                variant={filters.types.includes(type) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  const newTypes = filters.types.includes(type)
                    ? filters.types.filter((t) => t !== type)
                    : [...filters.types, type];
                  setFilters({ ...filters, types: newTypes });
                }}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(TaskPriority).map((priority) => (
              <Badge
                key={priority}
                variant={
                  filters.priorities.includes(priority) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  const newPriorities = filters.priorities.includes(priority)
                    ? filters.priorities.filter((p) => p !== priority)
                    : [...filters.priorities, priority];
                  setFilters({ ...filters, priorities: newPriorities });
                }}
              >
                {priority}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hidden Status</label>
          <Select
            value={
              filters.isHidden === null
                ? "all"
                : filters.isHidden
                ? "hidden"
                : "visible"
            }
            onValueChange={(value) => {
              setFilters({
                ...filters,
                isHidden: value === "all" ? null : value === "hidden",
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="visible">Visible Only</SelectItem>
              <SelectItem value="hidden">Hidden Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? (
                    format(filters.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.startDate || undefined}
                  onSelect={(date) =>
                    setFilters({ ...filters, startDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? (
                    format(filters.endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.endDate || undefined}
                  onSelect={(date) => setFilters({ ...filters, endDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button onClick={closeDialog}>Apply Filters</Button>
        </div>
      </div>
    </DialogContent>
  );
};
