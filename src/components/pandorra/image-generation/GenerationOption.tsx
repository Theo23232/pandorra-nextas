"use client"
import { Trash } from "lucide-react"
import { ReactNode } from "react"

import { deleteGeneration } from "@/actions/generation.action"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLoadingStore } from "@/hooks/use-loading-store"

export type GenerationOptionProps = {
  generationId: string
  children: ReactNode
}

export const GenerationOption = (props: GenerationOptionProps) => {
  const { startLoading, stopLoading } = useLoadingStore()
  const removeGen = async () => {
    startLoading()
    await deleteGeneration(props.generationId)
    stopLoading()
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={removeGen}
          >
            <Trash size={20} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
