"use client"
import {
  BoomBox,
  BotMessageSquare,
  Coins,
  Crown,
  Gift,
  Image,
  Sparkles,
  User2,
  Video,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useOnborda } from "onborda"
import { useEffect } from "react"

import { siteConfig } from "@/app/siteConfig"
import { Navbar } from "@/components/(main)/authentified-navbar"
import { Logo } from "@/components/logo"
import { UserProfileMobile } from "@/components/navigation/UserProfile"
import JetonCounter from "@/components/pandorra/jeton-counter"
import { useIsSidebar } from "@/hooks/use-is-sidebar"
import { useUser } from "@/hooks/use-user"
import { cx, focusRing } from "@/lib/utils"
import { RiHome2Line } from "@remixicon/react"

import MobileSidebar from "./MobileSidebar"

const navigation = [
  { name: "Explore", href: "/explore", icon: RiHome2Line, id: "tour1-step1" },
  { name: "Profile", href: "/profile", icon: User2, id: "tour1-step2" },
  { name: "Affiliate", href: "/affiliate", icon: Gift, id: "tour1-step3" },
  { name: "Ranking", href: "/ranking", icon: Crown, id: "tour1-step4" },
  { name: "Upgrade plan", href: "/pricing", icon: Sparkles, id: "tour1-step5" },
  {
    name: "Add more tokens",
    href: "/token",
    icon: Coins,
    id: "tour1-step6",
  },
] as const

const shortcuts = [
  {
    name: "Image AI",
    href: "/image/generation",
    icon: Image,
    id: "tour1-step6",
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    icon: BotMessageSquare,
    id: "tour1-step7",
  },
  {
    name: "Video generation",
    href: "/video",
    icon: Video,
    id: "tour1-step8",
  },
  {
    name: "Audio AI",
    href: "/audio",
    icon: BoomBox,
    id: "tour1-step9",
  },
] as const

export function Sidebar() {
  const { isSidebar } = useIsSidebar()

  const { startOnborda } = useOnborda()
  const { user } = useUser()
  const pathname = usePathname()
  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings) {
      return pathname?.startsWith("/settings")
    }
    return pathname === itemHref || pathname?.startsWith(itemHref)
  }
  useEffect(() => {
    if (user) {
      const tourOnboarding = user.tourOnboarding
      if (
        !tourOnboarding.includes("firsttour") &&
        !tourOnboarding.includes("stop")
      ) {
        startOnborda("firsttour")
      }
    }
  }, [user, startOnborda])

  return (
    <>
      {/* sidebar (lg+) */}
      <div className="sticky top-0 z-40 hidden lg:block">
        <Navbar />
      </div>
      {isSidebar && (
        <nav className="mt-16 hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
          <aside className="flex grow flex-col gap-y-6 overflow-y-auto bg-white p-4 pr-0 dark:bg-gray-950">
            <nav
              aria-label="core navigation links"
              className="flex flex-1 flex-col space-y-10"
            >
              <ul role="list" className="space-y-0.5">
                {navigation.map((item) => (
                  <li key={item.name} id={item.id}>
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
                  </li>
                ))}
              </ul>
              <div>
                <span className="text-sm font-medium leading-6 text-gray-500">
                  AI Assets
                </span>
                <ul aria-label="shortcuts" role="list" className="space-y-0.5">
                  {shortcuts.map((item) => (
                    <li key={item.name} id={item.id}>
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
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
            <div className="mt-auto">{/* TODO: incitate to subscribe */}</div>
          </aside>
        </nav>
      )}

      {/* top navbar (xs-lg) */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-2 shadow-sm sm:gap-x-6 sm:px-4 lg:hidden dark:border-gray-800 dark:bg-gray-950">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          <JetonCounter />

          <UserProfileMobile />
          <MobileSidebar />
        </div>
      </div>
    </>
  )
}
