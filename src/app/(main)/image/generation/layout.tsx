"use client"

import { redirect, useSearchParams } from "next/navigation"
import { ReactNode } from "react"

import { useUser } from "@/hooks/use-user"

export default function RouteLayout({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const queryPresetStyle = searchParams?.get("presetStyle")
  const queryModelId = searchParams?.get("modelId")
  const queryImageSize = searchParams?.get("imageSize")

  if (!queryPresetStyle && !queryModelId && !queryImageSize) {
    if (user) {
      return redirect(`/image/generation`)
    }
  }

  return <>{children}</>
}
