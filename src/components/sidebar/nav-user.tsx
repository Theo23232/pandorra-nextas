"use client"

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSubMenu,
    DropdownMenuSubMenuContent, DropdownMenuSubMenuTrigger, DropdownMenuTrigger
} from '@/components/tremor/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar
} from '@/components/ui/sidebar';
import { useUser } from '@/hooks/use-user';
import { RiComputerLine, RiMoonLine, RiSunLine } from '@remixicon/react';

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, isLoading } = useUser()
  const { theme, setTheme } = useTheme()
  if (user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="text-dark data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:text-white"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image!} alt={user.username} />
                  <AvatarFallback className="rounded-lg">
                    {user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.username}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image} alt={user.username} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.fullname || ""}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuGroup>
                <DropdownMenuSubMenu>
                  <DropdownMenuSubMenuTrigger>Theme</DropdownMenuSubMenuTrigger>
                  <DropdownMenuSubMenuContent>
                    <DropdownMenuRadioGroup
                      value={theme}
                      onValueChange={(value) => {
                        setTheme(value)
                      }}
                    >
                      <DropdownMenuRadioItem
                        aria-label="Switch to Light Mode"
                        value="light"
                        iconType="check"
                      >
                        <RiSunLine
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        aria-label="Switch to Dark Mode"
                        value="dark"
                        iconType="check"
                      >
                        <RiMoonLine
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        Dark
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        aria-label="Switch to System Mode"
                        value="system"
                        iconType="check"
                      >
                        <RiComputerLine
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        System
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubMenuContent>
                </DropdownMenuSubMenu>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles className="mr-2 size-4 shrink-0" />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck className="mr-2 size-4 shrink-0" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 size-4 shrink-0" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 size-4 shrink-0" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 size-4 shrink-0" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }
}
