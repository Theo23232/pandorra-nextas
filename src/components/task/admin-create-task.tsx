"use client"
import { Paperclip } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';

import { createTask } from '@/actions/task.actions';
import { Tabs, TabsList, TabsTrigger } from '@/components/nyxb/tabs';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { TaskPriority, TaskType } from '@prisma/client';

import type React from "react"

import type { CreateTaskDto } from "@/types/task"
export type TaskFormProps = {
  children: ReactNode
}
export function AdminTaskForm(props: TaskFormProps) {
  const { t } = useTranslation()
  const { control, handleSubmit, reset, watch, setValue } =
    useForm<CreateTaskDto>({
      defaultValues: {
        type: TaskType.BUG, // Default to task tab
        priority: TaskPriority.LOW, // Default priority
      },
    })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTab, setSelectedTab] = useState("list")
  const [files, setFiles] = useState<File[]>([])
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const watchedType = watch("type")

  const onSubmit = async (data: CreateTaskDto) => {
    setIsSubmitting(true)
    try {
      // Use the user-selected priority instead of determining it automatically
      await createTask(
        data.type,
        data.title,
        data.description,
        data.priority,
        true,
      )

      // Handle file uploads if applicable
      if (files.length > 0) {
        // Implement file upload logic here
      }

      toast({
        title: t(`Success`),
        description: t(`Task added`),
      })
      mutate("/api/admin/task?limit=1000")

      setOpen(false)
      reset()
      setFiles([])
      setSelectedTab("list")
    } catch (error) {
      toast({
        title: t(`Error`),
        description: t(`Failed to submit your task. Please try again.`),
        variant: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  // Suggestion helper for different task types
  const getPlaceholderByType = () => {
    switch (watchedType) {
      case TaskType.BUG:
        return "Please describe what happened, what you expected to happen, and steps to reproduce..."
      case TaskType.SUGGESTION:
        return "Please describe your idea and how it would improve your experience..."
      case TaskType.FEATURE:
        return "Describe the new feature, its purpose, and how it enhances your experience."
      case TaskType.IMPROVEMENT:
        return "Describe the improvement and how it refines or enhances existing functionality."
      default:
        return "Please provide detailed information..."
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setValue("type", value as TaskType)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t(`Task`)}</DialogTitle>
          <DialogDescription>
            {t(
              `We value your experience. Please share your thoughts with us to help improve our service.`,
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Tabs
                  defaultValue={field.value}
                  value={field.value}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value={TaskType.BUG}>Bug</TabsTrigger>
                    <TabsTrigger value={TaskType.FEATURE}>Feature</TabsTrigger>
                    <TabsTrigger value={TaskType.IMPROVEMENT}>
                      Improvment
                    </TabsTrigger>
                    <TabsTrigger value={TaskType.SUGGESTION}>
                      Suggestion
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
            <div className="hidden items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Paperclip size={16} />
                Attach Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              {files.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {files.length} file(s) selected
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input {...field} placeholder={t(`Title`)} required />
              )}
            />

            <Controller
              name="priority"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select priority")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskPriority.LOW}>{t("Low")}</SelectItem>
                    <SelectItem value={TaskPriority.MEDIUM}>
                      {t("Medium")}
                    </SelectItem>
                    <SelectItem value={TaskPriority.HIGH}>
                      {t("High")}
                    </SelectItem>
                    <SelectItem value={TaskPriority.CRITICAL}>
                      {t("Critical")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder={t(getPlaceholderByType())}
                required
                className="min-h-32"
              />
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {t(isSubmitting ? "Submitting..." : "Submit Task")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
