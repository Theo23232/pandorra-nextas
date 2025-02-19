"use client"

import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type BorderGradientProps = {
  children: ReactNode
  className?: string
}

export const BorderGradient = (props: BorderGradientProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-[#0099FF66] to-[#CC00FF77] p-[1px]",
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}
