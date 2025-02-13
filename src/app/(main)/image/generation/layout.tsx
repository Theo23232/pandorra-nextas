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

  if (user) {
    const presetStyle = user.imagePresetStylePreference
    const modelId = user.imageModelIdPreference
    const imageSize = user.imageSizePreference
    if (!queryImageSize) {
      return redirect(
        `/image/generation?imageSize=${imageSize}&modelId=${modelId}&presetStyle=${presetStyle}`,
      )
    }
  }
  return <>{children}</>
}
