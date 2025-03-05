import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { priorityColors, typeColors } from './constants';

import type React from "react"

import type { TaskWithRelations } from "@/types/task"
interface TaskDetailDialogProps {
  task: TaskWithRelations | null
  onClose: () => void
}

export const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  task,
  onClose,
}) => {
  if (!task) return null

  return (
    <Dialog open={!!task} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            <div className="flex items-center gap-2">
              <Badge className={typeColors[task.type]}>{task.type}</Badge>
              <span>{task.title}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={task.user.image} alt={task.user.username} />
                <AvatarFallback>
                  {task.user.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {task.user.fullname || task.user.username}
                </div>
                <div className="text-sm text-slate-500">
                  @{task.user.username}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-500">Created on</div>
              <div>{new Date(task.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              Priority:{" "}
              <span
                className={`h-2 w-2 rounded-full ${
                  priorityColors[task.priority]
                }`}
              ></span>{" "}
              {task.priority}
            </Badge>

            <Badge variant="outline">Status: {task.status}</Badge>

            {task.isHidden && <Badge variant="destructive">Hidden</Badge>}
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-medium">Description</h4>
            <p className="whitespace-pre-line">{task.description}</p>
          </div>

          {task.attachments.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium">Attachments</h4>
              <div className="flex flex-wrap gap-2">
                {task.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded bg-slate-100 p-2 text-sm hover:bg-slate-200"
                  >
                    <span>{attachment.filename}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {task.isHidden && task.moderator && (
            <div className="rounded-lg bg-red-50 p-4">
              <h4 className="mb-2 font-medium text-red-800">Moderation</h4>
              <div className="mb-2 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={task.moderator.image}
                    alt={task.moderator.username}
                  />
                  <AvatarFallback>
                    {task.moderator.username.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  Moderated by @{task.moderator.username}
                </span>
              </div>
              <p className="text-sm text-red-700">{task.moderationReason}</p>
            </div>
          )}

          {task.comments.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium">
                Comments ({task.comments.length})
              </h4>
              <div className="space-y-3">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg bg-slate-50 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={comment.user.image}
                          alt={comment.user.username}
                        />
                        <AvatarFallback>
                          {comment.user.username.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        @{comment.user.username}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="pl-8 text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
