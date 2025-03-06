import { ReactNode } from "react"

export default async function RouteLayout({
  children,
}: {
  children: ReactNode
}) {
  return <div className="overflow-hidden dark">{children}</div>
}
