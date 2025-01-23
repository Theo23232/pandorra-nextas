import { ReactNode } from 'react';

import { Sidebar } from '@/components/navigation/sidebar';

export default async function RouteLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <Sidebar />
      <main className="lg:pl-72">{children}</main>
    </>
  )
}
