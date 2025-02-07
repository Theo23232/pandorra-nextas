import {
  BoomBox,
  BotMessageSquare,
  Crown,
  Gift,
  Image,
  Sparkles,
  User2,
  Video,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/app/siteConfig"
import { Logo } from "@/components/logo"
import { Button } from "@/components/tremor/ui/button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/tremor/ui/drawer"
import { cx, focusRing } from "@/lib/utils"
import { RiHome2Line, RiMenuLine } from "@remixicon/react"

const navigation = [
  { name: "Explore", href: "/explore", icon: RiHome2Line },
  { name: "Profile", href: "/profile", icon: User2 },
  { name: "Affiliate", href: "/affiliate", icon: Gift },
  { name: "Ranking", href: "/ranking", icon: Crown },
  { name: "Upgrade plan", href: "/billing", icon: Sparkles },
] as const

const shortcuts = [
  {
    name: "Image AI",
    href: "/image/generation",
    icon: Image,
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    icon: BotMessageSquare,
  },
  {
    name: "Video generation",
    href: "/video",
    icon: Video,
  },
  {
    name: "Audio AI",
    href: "/audio",
    icon: BoomBox,
  },
] as const

export default function MobileSidebar() {
  const pathname = usePathname()
  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings) {
      return pathname.startsWith("/settings")
    }
    return pathname === itemHref || pathname.startsWith(itemHref)
  }
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            aria-label="open sidebar"
            className="group flex items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10"
          >
            <RiMenuLine
              className="size-6 shrink-0 sm:size-5"
              aria-hidden="true"
            />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="sm:max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              <Link href={"/explore"}>
                <Logo />
              </Link>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <nav
              aria-label="core mobile navigation links"
              className="flex flex-1 flex-col space-y-10"
            >
              <ul role="list" className="space-y-1.5">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <DrawerClose asChild>
                      <Link
                        prefetch={true}
                        href={item.href}
                        className={cx(
                          isActive(item.href)
                            ? "bg-gray-100 text-primary dark:bg-gray-900 dark:text-primary"
                            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                          "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                          focusRing,
                        )}
                      >
                        <item.icon
                          className="size-5 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
              </ul>
              <div>
                <span className="text-sm font-medium leading-6 text-gray-500 sm:text-xs">
                  AI Assets
                </span>
                <ul aria-label="shortcuts" role="list" className="space-y-0.5">
                  {shortcuts.map((item) => (
                    <li key={item.name}>
                      <Link
                        prefetch={true}
                        href={item.href}
                        className={cx(
                          pathname === item.href || pathname.includes(item.href)
                            ? "bg-gray-100 text-primary dark:bg-gray-900 dark:text-primary"
                            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                          "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                          focusRing,
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
