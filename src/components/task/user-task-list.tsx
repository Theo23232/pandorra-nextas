"use client";
import { Clock, Eye, MessageSquare, Paperclip } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { fetcher } from '@/lib/utils';
import { TaskWithRelations } from '@/types/task';

export function UserTaskList() {
  const {
    data: tasks,
    error,
    isLoading,
  } = useSWR<TaskWithRelations[]>("/api/task", fetcher);

  if (isLoading)
    return <div className="py-4 text-center">Loading your task...</div>;

  if (error)
    return (
      <div className="py-4 text-center text-red-500">Failed to load task</div>
    );

  if (!tasks || tasks.length === 0) {
    return (
      <div className="space-y-4">
        <Label>Your tasks</Label>
        <div className="py-8 text-center text-muted-foreground">
          <p>{"You haven't submitted any task yet."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label>Your tasks ({tasks.length})</Label>

      {tasks.map((task) => (
        <TaskCard task={task} key={task.id} />
      ))}
    </div>
  );
}

const TaskCard = ({ task }: { task: TaskWithRelations }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Format date with locale
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to get appropriate badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "destructive";
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "secondary";
      default:
        return "secondary";
    }
  };

  // Function to get appropriate status variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "default";
      case "CLOSED":
        return "secondary";
      case "IN_PROGRESS":
        return "secondary";
      case "UNDER_REVIEW":
        return "outline";
      default:
        return "outline";
    }
  };

  const hasComments = task.comments && task.comments.length > 0;
  const hasAttachments = task.attachments && task.attachments.length > 0;
  const hasModerator = task.moderator && task.moderatedBy;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {task.description}
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDetailsOpen(true)}
            className="p-2"
          >
            <Eye size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge>{task.type}</Badge>
          <Badge variant={getPriorityVariant(task.priority)}>
            {task.priority}
          </Badge>
          <Badge variant={getStatusVariant(task.status)}>
            {task.status.replace("_", " ")}
          </Badge>

          {hasComments && (
            <Badge variant="outline" className="flex items-center gap-1">
              <MessageSquare size={12} />
              {task.comments.length}
            </Badge>
          )}

          {hasAttachments && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Paperclip size={12} />
              {task.attachments.length}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {formatDate(task.createdAt)}
        </div>
        {task.updatedAt !== task.createdAt && (
          <div>Updated: {formatDate(task.updatedAt)}</div>
        )}
      </CardFooter>

      {/* Detailed View Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{task.title}</span>
            </DialogTitle>
            <DialogDescription>Task ID: {task.id}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status and Assignment */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge>{task.type}</Badge>
                <Badge variant={getPriorityVariant(task.priority)}>
                  {task.priority}
                </Badge>
                <Badge
                  variant={getStatusVariant(task.status)}
                  className="px-3 py-1"
                >
                  {task.status.replace("_", " ")}
                </Badge>
              </div>

              {task.assignedTo && (
                <span className="text-sm">
                  Assigned to: {task.assignedTo.username}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <div className="bg-muted p-3 rounded-md whitespace-pre-wrap">
                {task.description}
              </div>
            </div>

            {/* Moderation Information */}
            {hasModerator && (
              <div className="mt-4 bg-muted/50 p-3 rounded-md">
                <h4 className="font-medium text-sm">Moderation Notes</h4>
                {task.moderationReason && (
                  <p className="text-sm mt-1">{task.moderationReason}</p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>Moderated by:</span>
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={task.moderator!.image} />
                    <AvatarFallback>NA</AvatarFallback>
                  </Avatar>
                  <span>
                    {task.moderator!.fullname || task.moderator!.username}
                  </span>
                  {task.moderatedAt && (
                    <span>on {formatDate(task.moderatedAt)}</span>
                  )}
                </div>
              </div>
            )}

            {/* Attachments */}
            {hasAttachments && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="attachments">
                  <AccordionTrigger>
                    Attachments ({task.attachments.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {task.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors text-sm"
                        >
                          <Paperclip size={14} />
                          <span className="truncate">
                            {attachment.filename}
                          </span>
                        </a>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Comments */}
            {hasComments && (
              <div className="space-y-3">
                <Label>Comments ({task.comments.length})</Label>
                <div className="space-y-3 max-h-64 overflow-y-auto p-1">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="bg-muted p-3 rounded-md">
                      <div className="flex gap-2 items-center mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={
                              task.user.id === comment.user.id
                                ? task.user.image
                                : undefined
                            }
                          />
                          <AvatarFallback>
                            {task.user.id === comment.user.id
                              ? task.user.firstname?.[0] ||
                                task.user.username?.[0]
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {task.user.id === comment.user.id
                            ? task.user.fullname || task.user.username
                            : "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Timestamps */}
            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
              <div>Created: {formatDate(task.createdAt)}</div>
              <div>Last updated: {formatDate(task.updatedAt)}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
