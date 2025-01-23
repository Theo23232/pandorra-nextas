"use client"

import { Info, LucideIcon } from 'lucide-react';

import {
    SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';

export function NavSecondary({
  projects,
  title,
}: {
  title: string
  projects: {
    name: string
    url: string
    icon: LucideIcon
    details: string
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
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
              <Info size={14} />
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
