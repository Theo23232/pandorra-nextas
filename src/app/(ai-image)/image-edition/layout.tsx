import { Sidebar } from "@/components/(main)/navigation/sidebar"

export interface LayoutProps {
  children: React.ReactNode
  params?: any // Adjust this type as needed
}
export default async function RouteLayout(props: LayoutProps) {
  return (
    <>
      <Sidebar />
      <main className="min-h-screen p-8 lg:pl-80">{props.children}</main>
    </>
  )
}
