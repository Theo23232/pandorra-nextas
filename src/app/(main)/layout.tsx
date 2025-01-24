import { ReactNode } from "react"

import { Sidebar } from "@/components/(main)/navigation/sidebar"

export default async function RouteLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <Sidebar />
      <main className="min-h-screen p-8 pl-80">{children}</main>
    </>
  )
}
