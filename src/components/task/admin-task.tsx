"use client"
import {
    ArrowUpDown, ChevronDown, Clock, Eye, Filter, MessageSquare, Paperclip, Search, X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { commentTask } from '@/actions/task.actions';
import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetcher } from '@/lib/utils';
import { TaskWithRelations } from '@/types/task';
import { TaskPriority, TaskType } from '@prisma/client';

// Define the response type for the paginated API
interface TaskResponse {
  tasks: TaskWithRelations[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
}

export function AdminTaskDashboard() {
  const { data: TaskStatus = [] } = useSWR<string[]>(
    "/api/admin/task/status/list",
    fetcher,
  )
  // Pagination states
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { toast } = useToast()
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [isHiddenFilter, setIsHiddenFilter] = useState<string | null>(null)

  // Sort state
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Detail view states
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(
    null,
  )
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Moderation states
  const [isModerateOpen, setIsModerateOpen] = useState(false)
  const [moderationReason, setModerationReason] = useState("")
  const [isHidden, setIsHidden] = useState(false)

  // Comment state
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const [commentContent, setCommentContent] = useState("")

  // Status update state
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [assignTo, setAssignTo] = useState<string>("")

  // To track if filter changed and we need to reset to page 1
  const [filterChanged, setFilterChanged] = useState(false)

  // Build query parameters for API call
  const buildQueryString = () => {
    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append("limit", limit.toString())

    if (searchQuery) params.append("search", searchQuery)

    typeFilter.forEach((type) => params.append("type", type))
    priorityFilter.forEach((priority) => params.append("priority", priority))
    statusFilter.forEach((status) => params.append("status", status))

    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)
    if (isHiddenFilter !== null) params.append("isHidden", isHiddenFilter)

    params.append("sortBy", sortBy)
    params.append("sortDirection", sortDirection)

    return params.toString()
  }

  // Fetch data with all params
  const { data, error, isLoading, mutate } = useSWR<TaskResponse>(
    `/api/admin/task?${buildQueryString()}`,
    fetcher,
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    if (filterChanged) {
      setPage(1)
      setFilterChanged(false)
    }
  }, [filterChanged])

  // Handle filter changes
  const handleFilterChange = () => {
    setFilterChanged(true)
  }

  // Format date helper
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get badge variants
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "destructive"
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "default"
      case "CLOSED":
        return "secondary"
      case "IN_PROGRESS":
        return "secondary"
      case "UNDER_REVIEW":
        return "outline"
      default:
        return "outline"
    }
  }

  // Handle moderation submission
  const handleModerate = async () => {
    if (!selectedTask) return

    try {
      const response = await fetch("/api/admin/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedTask.id,
          isHidden,
          moderationReason,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to moderate task")
      }

      toast({
        title: "Task moderated",
        description: `Task ${isHidden ? "hidden" : "unhidden"} successfully`,
      })

      mutate()
      setIsModerateOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to moderate task",
        variant: "error",
      })
    }
  }

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedTask || !newStatus) return

    try {
      const response = await fetch("/api/admin/task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedTask.id,
          status: newStatus,
          assignedTo: assignTo || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      toast({
        title: "Status updated",
        description: `Task status updated to ${newStatus}`,
      })

      mutate()
      setIsStatusUpdateOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "error",
      })
    }
  }

  // Handle adding comment
  const handleAddComment = async () => {
    if (!selectedTask || !commentContent.trim()) return

    await commentTask(selectedTask.id, commentContent)
      .then(() => {
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully",
        })
        mutate()
        setCommentContent("")
        setIsCommentOpen(false)
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to add comment",
          variant: "error",
        })
        throw new Error("Failed to add comment")
      })
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load task: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <h2 className="text-2xl font-bold tracking-tight">Task Management</h2>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search task..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              handleFilterChange()
            }}
            className="w-64"
          />
          <Button variant="outline" size="icon" onClick={() => mutate()}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter section */}
      <div className="flex flex-wrap items-center gap-2">
        <Label>Filters:</Label>

        {/* Type filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-3.5 w-3.5" />
              Type
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Task Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(TaskType).map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={typeFilter.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setTypeFilter([...typeFilter, type])
                  } else {
                    setTypeFilter(typeFilter.filter((t) => t !== type))
                  }
                  handleFilterChange()
                }}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-3.5 w-3.5" />
              Priority
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Priority Level</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(TaskPriority).map((priority) => (
              <DropdownMenuCheckboxItem
                key={priority}
                checked={priorityFilter.includes(priority)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPriorityFilter([...priorityFilter, priority])
                  } else {
                    setPriorityFilter(
                      priorityFilter.filter((p) => p !== priority),
                    )
                  }
                  handleFilterChange()
                }}
              >
                {priority}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-3.5 w-3.5" />
              Status
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {TaskStatus.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter.includes(status)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setStatusFilter([...statusFilter, status])
                  } else {
                    setStatusFilter(statusFilter.filter((s) => s !== status))
                  }
                  handleFilterChange()
                }}
              >
                {status.replace("_", " ")}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hidden filter */}
        <Select
          value={isHiddenFilter ?? "all"}
          onValueChange={(value) => {
            setIsHiddenFilter(value === "all" ? null : value)
            handleFilterChange()
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Hidden status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Hidden</SelectItem>
            <SelectItem value="false">Not Hidden</SelectItem>
          </SelectContent>
        </Select>

        {/* Date filters */}
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              handleFilterChange()
            }}
            className="w-auto"
            placeholder="Start date"
          />
          <span>-</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value)
              handleFilterChange()
            }}
            className="w-auto"
            placeholder="End date"
          />
        </div>

        {/* Sort controls */}
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value)
            handleFilterChange()
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="updatedAt">Updated Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            handleFilterChange()
          }}
          title={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>

        {/* Clear filters */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("")
            setTypeFilter([])
            setPriorityFilter([])
            setStatusFilter([])
            setStartDate("")
            setEndDate("")
            setIsHiddenFilter(null)
            setSortBy("createdAt")
            setSortDirection("desc")
            handleFilterChange()
          }}
          className="ml-auto"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Clear Filters
        </Button>
      </div>

      {/* Results display */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-4 text-center">Loading task data...</div>
        ) : (
          <>
            <div className="grid gap-4 xl:grid-cols-2">
              {data?.tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {task.title}
                          {task.isHidden && (
                            <Badge
                              variant="outline"
                              className="border-red-500 text-red-500"
                            >
                              Hidden
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <span>ID: {task.id}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={task.user.image} />
                              <AvatarFallback>
                                {task.user.firstname?.[0] ||
                                  task.user.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            {task.user.fullname || task.user.username}
                          </span>
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTask(task)
                          setIsDetailsOpen(true)
                        }}
                        className="p-2"
                      >
                        <Eye size={18} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{task.type}</Badge>
                      <Badge variant={getPriorityVariant(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge variant={getStatusVariant(task.status)}>
                        {task.status.replace("_", " ")}
                      </Badge>

                      {task.comments.length > 0 && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <MessageSquare size={12} />
                          {task.comments.length}
                        </Badge>
                      )}

                      {task.attachments.length > 0 && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Paperclip size={12} />
                          {task.attachments.length}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(task.createdAt)}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTask(task)
                          setNewStatus(task.status)
                          setAssignTo(task.assignedToId || "")
                          setIsStatusUpdateOpen(true)
                        }}
                      >
                        Update Status
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTask(task)
                          setIsHidden(task.isHidden)
                          setModerationReason(task.moderationReason || "")
                          setIsModerateOpen(true)
                        }}
                      >
                        Moderate
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTask(task)
                          setCommentContent("")
                          setIsCommentOpen(true)
                        }}
                      >
                        Comment
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Empty state */}
            {data?.tasks.length === 0 && (
              <div className="rounded-md border py-8 text-center">
                <p className="text-muted-foreground">
                  No task found matching your filters.
                </p>
              </div>
            )}

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label>Items per page:</Label>
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => {
                      setLimit(Number.parseInt(value))
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue placeholder={limit.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1}-
                    {Math.min(page * limit, data.pagination.totalCount)} of{" "}
                    {data.pagination.totalCount}
                  </span>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(Math.max(1, page - 1))}
                        // disabled={page === 1}
                      />
                    </PaginationItem>

                    {/* Display current page and neighbors */}
                    {Array.from(
                      { length: Math.min(5, data.pagination.totalPages) },
                      (_, i) => {
                        let pageNumber
                        if (data.pagination.totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (page <= 3) {
                          pageNumber = i + 1
                        } else if (page >= data.pagination.totalPages - 2) {
                          pageNumber = data.pagination.totalPages - 4 + i
                        } else {
                          pageNumber = page - 2 + i
                        }

                        if (
                          pageNumber > 0 &&
                          pageNumber <= data.pagination.totalPages
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={pageNumber === page}
                                onClick={() => setPage(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        }
                      },
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage(
                            Math.min(data.pagination.totalPages, page + 1),
                          )
                        }
                        // disabled={page === data.pagination.totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task detail dialog */}
      {selectedTask && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedTask.title}</span>
              </DialogTitle>
              <DialogDescription>Task ID: {selectedTask.id}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Type and Priority */}
              <div className="flex gap-2">
                <Badge>{selectedTask.type}</Badge>
                <Badge variant={getPriorityVariant(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
                <Badge variant={getStatusVariant(selectedTask.status)}>
                  {selectedTask.status.replace("_", " ")}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <p className="mt-1 text-sm">{selectedTask.description}</p>
              </div>

              {/* User Information */}
              <div>
                <Label>Submitted by</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedTask.user.image} />
                    <AvatarFallback>
                      {selectedTask.user.firstname?.[0] ||
                        selectedTask.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {selectedTask.user.fullname || selectedTask.user.username}
                  </span>
                </div>
              </div>

              {/* Attachments */}
              {selectedTask.attachments.length > 0 && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="attachments">
                    <AccordionTrigger>
                      Attachments ({selectedTask.attachments.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTask.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-md bg-secondary p-2 transition-colors hover:bg-secondary/80"
                          >
                            <Paperclip className="h-4 w-4" />
                            <span className="truncate text-sm">
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
              {selectedTask.comments.length > 0 && (
                <div>
                  <Label>Comments</Label>
                  <div className="mt-1 max-h-60 space-y-2 overflow-y-auto">
                    {selectedTask.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-md bg-secondary p-2"
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={comment.user.image} />
                            <AvatarFallback>
                              {comment.user.firstname?.[0] ||
                                comment.user.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {comment.user.fullname || comment.user.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Moderation Information */}
              {selectedTask.moderator && (
                <div className="rounded-md bg-muted p-3">
                  <Label>Moderation Information</Label>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      {selectedTask.isHidden ? "Hidden" : "Visible"}
                    </p>
                    {selectedTask.moderationReason && (
                      <p className="text-sm">
                        <span className="font-medium">Reason:</span>{" "}
                        {selectedTask.moderationReason}
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="font-medium">Moderated by:</span>{" "}
                      {selectedTask.moderator.fullname ||
                        selectedTask.moderator.username}
                    </p>
                    {selectedTask.moderatedAt && (
                      <p className="text-sm">
                        <span className="font-medium">Moderated at:</span>{" "}
                        {formatDate(selectedTask.moderatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Created: {formatDate(selectedTask.createdAt)}</div>
                <div>Last updated: {formatDate(selectedTask.updatedAt)}</div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Moderation dialog */}
      <Dialog open={isModerateOpen} onOpenChange={setIsModerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate Task</DialogTitle>
            <DialogDescription>
              Update the visibility and add a moderation reason for this task.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isHidden"
                checked={isHidden}
                onCheckedChange={(checked) => setIsHidden(checked as boolean)}
              />
              <Label htmlFor="isHidden">Hide this task</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="moderationReason">Moderation Reason</Label>
              <Textarea
                id="moderationReason"
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                placeholder="Explain why this task is being moderated..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModerateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleModerate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status update dialog */}
      <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task Status</DialogTitle>
            <DialogDescription>
              Change the status and assign this task to a team member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignTo">Assign To</Label>
              <Input
                id="assignTo"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                placeholder="Enter username or leave blank"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusUpdateOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment dialog */}
      <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Add a new comment to this task.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Enter your comment here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddComment}>Add Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
