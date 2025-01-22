"use client"

import {
  BotMessageSquare,
  Command,
  Frame,
  Image,
  LifeBuoy,
  Send,
  Settings2,
  User2,
  Video,
} from "lucide-react"
import * as React from "react"

import { FooterSidebar } from "@/components/sidebar/nav-footer"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Explore",
      url: "/explore",
      icon: Frame,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User2,
    },

    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Image AI",
      url: "/image/generation",
      icon: Image,
      items: [
        {
          title: "Image generation",
          url: "/image/generation",
        },
        {
          title: "Image",
          url: "/image/edit",
        },
        {
          title: "Library",
          url: "/image/library",
        },
      ],
    },
    {
      title: "AI Assistant",
      url: "/assistant/",
      icon: BotMessageSquare,
      items: [
        {
          title: "Text to code",
          url: "/assistant/code",
        },
        {
          title: "Talk to AI",
          url: "/image/edit",
        },
      ],
    },
    {
      title: "Video generation",
      url: "/video/",
      icon: Video,
      items: [
        {
          title: "Text to video",
          url: "/video/text",
        },
        {
          title: "Image to video",
          url: "/video/image",
        },
      ],
    },
  ],

  navFooter: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function SettingSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">pandorra</span>
                  <span className="truncate text-xs">Boilerplate</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMain items={data.navSecondary} />
        <FooterSidebar items={data.navFooter} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
