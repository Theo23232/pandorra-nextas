"use client"
import { notFound, redirect } from "next/navigation"
import { ReactNode } from "react"

import { Sidebar } from "@/components/(main)/adminNavigation/sidebar"
import { useIsSidebar } from "@/hooks/use-is-sidebar"
import { useUser } from "@/hooks/use-user"

export default function RouteLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, isError } = useUser()
  const { isSidebar } = useIsSidebar()

  if (isLoading) {
    return null // Or a loading state
  }
  if (!user || isError) {
    return redirect("/auth")
  }
  if (user) {
    if (user.permissions.includes("admin")) {
      return (
        <>
          <Sidebar />
          <main
            className={`pr-4 pt-0 ${isSidebar ? "lg:pl-64" : "lg:pl-[4.5rem]"}`}
          >
            {children}
          </main>
        </>
      )
    } else {
      return notFound()
    }
  } else {
    return notFound()
  }
}
