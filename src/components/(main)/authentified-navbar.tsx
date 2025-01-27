"use client"

import { useState } from 'react';

import { Logo } from '@/components/logo';
import { UserProfileMobile } from '@/components/navigation/UserProfile';
import JetonCounter from '@/components/pandorra/jeton-counter';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white bg-opacity-70 px-2 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-4 dark:border-gray-800 dark:bg-gray-950 dark:bg-opacity-75 dark:backdrop-blur-md">
      <Logo />
      <div className="flex items-center gap-1 sm:gap-2">
        <JetonCounter />

        <UserProfileMobile />
      </div>
    </div>
  )
}
