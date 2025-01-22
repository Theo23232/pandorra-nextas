import { Sidebar } from '@/components/(main)/navigation/sidebar';

import type { LayoutParams } from "@/types/next"

export default async function RouteLayout(props: LayoutParams<{}>) {
  return (
    <>
      <Sidebar />
      <main className="min-h-screen p-8 lg:pl-80">{props.children}</main>
    </>
  )
}
