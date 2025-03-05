import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { priorityColors, typeColors } from './constants';

import type React from "react";

import type { TaskWithRelations } from "@/types/task";
interface TaskCardProps {
  task: TaskWithRelations;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <Card
      className={`overflow-hidden w-full ${task.isHidden ? "opacity-50" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-3 cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <Badge className={typeColors[task.type]}>{task.type}</Badge>
          <div
            className={`rounded-full w-3 h-3 ${priorityColors[task.priority]}`}
            title={task.priority}
          ></div>
        </div>

        <h3 className="font-medium line-clamp-2 mb-2 w-[320px]  ">
          {task.title}
        </h3>

        <div className="flex justify-between items-center text-xs text-slate-500">
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
  );
};
