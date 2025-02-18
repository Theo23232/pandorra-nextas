import { notFound } from "next/navigation"
import { ReactNode } from "react"

import { Sidebar } from "@/components/(main)/adminNavigation/sidebar"
import { currentUser } from "@/lib/current-user"

export default async function RouteLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await currentUser()
  if (user) {
    if (user.permissions.includes("admin")) {
      return (
        <>
          <Sidebar />
          <main className="lg:pl-64">{children}</main>
        </>
      )
    } else {
      return notFound()
    }
  } else {
    return notFound()
  }
}
