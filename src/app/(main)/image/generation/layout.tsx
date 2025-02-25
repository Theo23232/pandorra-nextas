"use client"

import { redirect } from "next/navigation"
import { ReactNode } from "react"

import { useUser } from "@/hooks/use-user"

export default function RouteLayout({ children }: { children: ReactNode }) {
  const { user } = useUser()

  if (user) {
    return <>{children}</>
  }
  return redirect(`/auth`)
}
