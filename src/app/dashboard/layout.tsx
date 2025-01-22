import { Sidebar } from '@/components/navigation/sidebar';

import type { LayoutParams } from "@/types/next";

export default async function RouteLayout(props: LayoutParams<{  }>) {
  return <>
    <Sidebar />
    <main className="lg:pl-72">{props.children}</main>
  </>
}