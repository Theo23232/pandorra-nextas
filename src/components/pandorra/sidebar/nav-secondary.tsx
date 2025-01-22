'use client';

import { Info, LucideIcon, MoreHorizontal } from 'lucide-react';

import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/main-tooltip';
import {
    SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton,
    SidebarMenuItem, useSidebar
} from '@/components/ui/sidebar';

export function NavSecondary({
  projects,
  title,
}: {
  title: string;
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    details: string;
  }[];
}) {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <SidebarMenuAction showOnHover>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} />
                  </TooltipTrigger>
                  <TooltipContent>{item.details}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
