"use client"
import {
    BoomBox, BotMessageSquare, Image, ListTodo, MessageSquare, SquareKanban, Users, Video
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { siteConfig } from '@/app/siteConfig';
import { Navbar } from '@/components/(main)/authentified-navbar';
import { Logo } from '@/components/logo';
import { UserProfileMobile } from '@/components/navigation/UserProfile';
import { Tooltip } from '@/components/tremor/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsSidebar } from '@/hooks/use-is-sidebar';
import { useUser } from '@/hooks/use-user';
import { cn, cx, focusRing } from '@/lib/utils';
import { RiHome2Line } from '@remixicon/react';

import MobileSidebar from './MobileSidebar';

const navigation = [
  { name: "Overview", href: "/dashboard", icon: RiHome2Line },
  { name: "Utilisateurs", href: "/dashboard/profile", icon: Users },
  { name: "Kanban", href: "/dashboard/kanban", icon: SquareKanban },
  { name: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
] as const

const shortcuts = [
  {
    name: "Pandorra Chat",
    href: "/old_chat",
    icon: MessageSquare,
    id: "tour1-step7",
  },
  {
    name: "Image AI",
    href: "/image/generation",
    icon: Image,
    id: "tour1-step8",
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    icon: BotMessageSquare,
    id: "tour1-step9",
  },
  {
    name: "Video generation",
    href: "/video",
    icon: Video,
    id: "tour1-step10",
  },
  {
    name: "Audio AI",
    href: "/audio",
    icon: BoomBox,
    id: "tour1-step11",
  },
] as const

export function Sidebar() {
  const { t } = useTranslation()
  const { isSidebar } = useIsSidebar()

  const { user } = useUser()
  const pathname = usePathname()
  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings) {
      return pathname?.startsWith("/dashboard")
    }
    return pathname === itemHref
  }

  return (
    <>
      {/* sidebar (lg+) */}
      <div className="sticky top-0 z-40 hidden lg:block">
        <Navbar />
      </div>

      <nav
        className={cn(
          "mt-16 hidden duration-200 transition-width lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col",
          isSidebar ? "lg:w-60" : "lg:w-14",
        )}
      >
        <ScrollArea className="flex h-screen min-h-screen grow flex-col gap-y-6 p-2 pr-0 dark:bg-gray-950">
          <nav
            aria-label="core navigation links"
            className="flex flex-1 flex-col space-y-10"
          >
            <ul role="list" className="space-y-0.5">
              {navigation.map((item) => (
                <li key={item.name}>
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
                    <>
                      <item.icon
                        className={`shrink-0 duration-200 transition-size ${isSidebar ? "size-5" : "size-6"}`}
                        aria-hidden="true"
                      />
                      {isSidebar ? (
                        t(item.name)
                      ) : (
                        <Tooltip content={t(item.name)} side="right">
                          <span className="sr-only">{t(item.name)}</span>
                        </Tooltip>
                      )}
                    </>
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              {/* {isSidebar ? (
                <span className="text-sm font-medium leading-6 text-gray-500">
                  {t(`AI Assets`)}
                </span>
              ) : (
                <Separator orientation="horizontal" className="mb-8" />
              )}

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
                      <>
                        <item.icon
                          className={`shrink-0 duration-200 transition-size ${isSidebar ? "size-5" : "size-6"}`}
                          aria-hidden="true"
                        />
                        {isSidebar ? (
                          t(item.name)
                        ) : (
                          <Tooltip content={t(item.name)} side="right">
                            <span className="sr-only">{t(item.name)}</span>
                          </Tooltip>
                        )}
                      </>
                    </Link>
                  </li>
                ))}
              </ul> */}
            </div>
          </nav>
        </ScrollArea>
      </nav>

      {/* top navbar (xs-lg) */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-2 shadow-sm sm:gap-x-6 sm:px-4 lg:hidden dark:border-gray-800 dark:bg-gray-950">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          <UserProfileMobile />
          <MobileSidebar />
        </div>
      </div>
    </>
  )
}
