"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import Bounce from '@/components/animated/uibeats/bounce';
import { NavigationMenuNavbar } from '@/components/landing/NavigationMenuNavbar';
import { Button } from '@/components/ui/button';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

// eslint-disable-next-line react/display-name
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <Bounce
      className={`fixed top-0 z-50 flex w-full items-center justify-center p-4`}
    >
      {scrolled && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black"></div>
      )}
      <div className="relative flex w-full max-w-[1274px] items-center justify-between">
        <a href="/#hero">
          <Image
            src="/logo/logo-full-white.png"
            alt="logo"
            className="h-[40px] w-[176px] object-contain"
            width={1000}
            height={500}
          />
        </a>
        <div className="flex">
          <NavigationMenuNavbar />
          <Link href={"/auth"}>
            <Button
              variant={"gradient"}
              className="mr-2 flex h-11 rounded-full px-6 transition-all ease-in-out"
            >
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </Bounce>
  )
}
