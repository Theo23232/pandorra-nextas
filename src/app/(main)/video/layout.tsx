import { redirect } from "next/navigation"
import { ReactNode } from "react"

import { Sidebar } from "@/app/(main)/video/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { currentUser } from "@/lib/current-user"

export default async function RouteLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await currentUser()
  if (!user) return redirect("/auth")

  return (
    <div className="flex pt-4">
      <Sidebar />

      <ScrollArea className="w-full p-6 pt-0">{children}</ScrollArea>
    </div>
  )
}
