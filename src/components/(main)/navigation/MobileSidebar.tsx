import {
    BoomBox, BotMessageSquare, Coins, Crown, Gift, Image, MessageSquare, Sparkles, User2, Video
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { siteConfig } from '@/app/siteConfig';
import { Logo } from '@/components/logo';
import { Button } from '@/components/tremor/ui/button';
import {
    Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger
} from '@/components/tremor/ui/drawer';
import { Tooltip } from '@/components/tremor/ui/tooltip';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsSidebar } from '@/hooks/use-is-sidebar';
import { useUser } from '@/hooks/use-user';
import { cn, cx, focusRing } from '@/lib/utils';
import { RiHome2Line, RiMenuLine } from '@remixicon/react';

const navigation = [
  { name: "Explore", href: "/explore", icon: RiHome2Line },
  { name: "Profile", href: "/profile", icon: User2 },
  { name: "Affiliate", href: "/affiliate", icon: Gift },
  { name: "Ranking", href: "/ranking", icon: Crown },
] as const

const shortcuts = [
  {
    name: "Pandorra Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Image AI",
    href: "/image/generation",
    icon: Image,
  },

  {
    name: "Video generation",
    href: "/video",
    icon: Video,
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    icon: BotMessageSquare,
  },
  {
    name: "Audio AI",
    href: "/audio",
    icon: BoomBox,
  },
] as const

export default function MobileSidebar() {
  const { t } = useTranslation()
  const { isSidebar } = useIsSidebar()
  const { user } = useUser()

  const pathname = usePathname()
  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings) {
      return pathname?.startsWith("/settings")
    }
    return pathname === itemHref || pathname?.startsWith(itemHref)
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
                        {t(item.name)}
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
                <li>
                  <Link href={"/upgrade"}>
                    <li id="tour1-step5" className="w-full cursor-pointer">
                      <DrawerClose asChild>
                        <div
                          className={cx(
                            "w-full text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                            "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                            focusRing,
                          )}
                        >
                          <Sparkles
                            className={`shrink-0 duration-200 transition-size ${isSidebar ? "size-5" : "size-6"}`}
                            aria-hidden="true"
                          />
                          {isSidebar ? (
                            t("Upgrade plan")
                          ) : (
                            <Tooltip content={t("Upgrade plan")} side="right">
                              <span className="sr-only">
                                {t("Upgrade plan")}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </DrawerClose>
                    </li>
                  </Link>
                </li>
                <li>
                  <Link href={"/add-token"}>
                    <li id="tour1-step6" className="w-full cursor-pointer">
                      <DrawerClose asChild>
                        <div
                          className={cx(
                            "w-full text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                            "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                            focusRing,
                          )}
                        >
                          <Coins
                            className={`shrink-0 duration-200 transition-size ${isSidebar ? "size-5" : "size-6"}`}
                            aria-hidden="true"
                          />

                          {isSidebar ? (
                            t("Add more tokens")
                          ) : (
                            <Tooltip
                              content={t("Add more tokens")}
                              side="right"
                            >
                              <span className="sr-only">
                                {t("Add more tokens")}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </DrawerClose>
                    </li>
                  </Link>
                </li>
              </ul>
              <div>
                <span className="text-sm font-medium leading-6 text-gray-500 sm:text-xs">
                  {t(`AI Assets`)}
                </span>
                <ul aria-label="shortcuts" role="list" className="space-y-0.5">
                  {shortcuts.map((item) => (
                    <li key={item.name}>
                      <DrawerClose asChild>
                        <Link
                          prefetch={true}
                          href={item.href}
                          className={cx(
                            pathname === item.href ||
                              pathname?.includes(item.href)
                              ? "bg-gray-100 text-primary dark:bg-gray-900 dark:text-primary"
                              : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                            "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                            focusRing,
                          )}
                        >
                          <item.icon className="size-4 shrink-0" />
                          {t(item.name)}
                        </Link>
                      </DrawerClose>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={cn(
                  "mt-10 min-w-56 transition-opacity duration-200",
                  isSidebar ? "opacity-100" : "opacity-0",
                )}
              >
                <Card className="w-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-center text-2xl font-bold">
                      {user?.plan === "Free" || user?.plan === "FreePaid"
                        ? t("Free")
                        : user?.plan === "Hebdomadaire"
                          ? t("Weekly")
                          : user?.plan === "CreatorPack"
                            ? t("CreatorPack")
                            : user?.plan === "VisionPro"
                              ? t("VisionPro")
                              : user?.plan === "PandorraInfini"
                                ? t("PandorraInfini")
                                : user?.plan === "CreatorPackYear"
                                  ? t("CreatorPackYear")
                                  : user?.plan === "VisionProYear"
                                    ? t("VisionProYear")
                                    : t("PandorraInfiniYear")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                      {t(
                        "Subscribe to a plan features and get full access on all features!",
                      )}
                    </p>
                  </CardContent>
                  <CardFooter>
                    {user?.plan === "Free" || user?.plan === "FreePaid" ? (
                      <Link href={"/upgrade"}>
                        <Button className="w-full">{t(`Upgrade Now`)}</Button>
                      </Link>
                    ) : (
                      <Link href={"/add-token"}>
                        <Button className="w-full">{t(`Add credits`)}</Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
