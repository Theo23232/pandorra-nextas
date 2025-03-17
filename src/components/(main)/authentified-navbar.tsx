"use client"

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';

import { ToggleTheme } from '@/components/(main)/ToggleTheme';
import { Logo } from '@/components/logo';
import { UserProfileMobile } from '@/components/navigation/UserProfile';
import { NotificationListener } from '@/components/notification-listener';
import JetonCounter from '@/components/pandorra/jeton-counter';
import { useIsSidebar } from '@/hooks/use-is-sidebar';

export function Navbar() {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between bg-white bg-opacity-70 px-2 backdrop-blur-md sm:gap-x-6 sm:px-4 dark:bg-gray-950 dark:bg-opacity-75 dark:backdrop-blur-md">
      <div className="flex cursor-pointer items-center">
        <Link href={"/explore"}>
          <Logo />
        </Link>
        <FloatingButton />
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <NotificationListener />
        <ToggleTheme />
        <JetonCounter />
        <UserProfileMobile />
      </div>
    </div>
  )
}

export const FloatingButton = () => {
  const { isSidebar, toggleSidebar } = useIsSidebar()

  return (
    <div
      id="tour3-step1"
      className="ml-4 cursor-pointer rounded p-2 hover:bg-accent hover:text-accent-foreground"
      onClick={toggleSidebar}
    >
      {isSidebar ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
    </div>
  )
}
