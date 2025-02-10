"use client"

import Link from "next/link"
import * as React from "react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export function NavigationMenuNavbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/affiliation" prefetch legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-white hover:bg-accent/50",
              )}
            >
              Affiliate
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/pricing" prefetch legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-white hover:bg-accent/50",
              )}
            >
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/token" prefetch legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-white hover:bg-accent/50",
              )}
            >
              Credits
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

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
ListItem.displayName = "ListItem"
