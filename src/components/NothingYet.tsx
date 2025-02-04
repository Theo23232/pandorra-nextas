"use client"
import { BoxSelect } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/tremor/ui/card"
import { cn } from "@/lib/utils"

export type NothingYetProps = {
  title: string
  subtitle: string
  className?: string
}

export const NothingYet = (props: NothingYetProps) => {
  return (
    <Card className={cn("w-full bg-background p-6", props.className)}>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-gray-200 p-4 dark:bg-gray-700">
          <BoxSelect className="h-8 w-8 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">{props.title}</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {props.subtitle}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  )
}
