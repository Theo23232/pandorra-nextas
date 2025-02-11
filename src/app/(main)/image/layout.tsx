import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { currentUser } from '@/lib/current-user';

export default async function RouteLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await currentUser()
  if (!user) return redirect("/auth")

  return <div>{children}</div>
}
