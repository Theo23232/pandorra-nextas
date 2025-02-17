'use client';

import useSWR from 'swr';

import { AdminSidebar } from '@/components/sidebar/admin-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { fetcher } from '@/lib/utils';
import { User as UserType } from '@prisma/client';

import type { LayoutParams } from '@/types/next';
export default function RouteLayout(props: LayoutParams) {
  const { data: user } = useSWR<UserType>('/api/profile/current', fetcher);

  if (user) {
    return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
            </div>
          </header>
          <div className='px-4'>{props.children}</div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
}
