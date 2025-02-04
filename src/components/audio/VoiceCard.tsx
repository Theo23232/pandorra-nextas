/* eslint-disable @next/next/no-img-element */
"use client"

import { Badge } from "@/components/tremor/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface VoiceCardProps {
  id: string
  name: string
  accent: string
  category: string
  gender: string
  // voiceType: string
  age: string
}
export const VoiceCard = ({
  id,
  name,
  accent,
  category,
  gender,
  // voiceType,
  age,
}: VoiceCardProps) => {
  return (
    <div className="flex cursor-pointer items-center rounded-xl p-4 hover:bg-muted/25">
      <img
        src={`https://api.dicebear.com/9.x/glass/svg?seed=${id}&backgroundType=solid,gradientLinear&randomizeIds=true`}
        alt={`Agent ${id}`}
        className="mr-2 h-10 w-10 rounded-full"
      />
      <div className="flex flex-col items-start gap-1">
        <p className="text-md max-w-[300px] truncate text-ellipsis">{name}</p>
        <div className="flex cursor-pointer items-center gap-3">
          <Badge>{category}</Badge>
          <Badge>{accent}</Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge>+3 more</Badge>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col gap-2 bg-gray-100 text-sm text-black dark:bg-muted dark:text-white">
                {/* <p className="px-2">{voiceType}</p> */}
                <p className="px-2">{age}</p>
                <p className="px-2">{gender}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
