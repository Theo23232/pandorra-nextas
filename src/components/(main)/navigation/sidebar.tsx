"use client"
import {
  BoomBox,
  BotMessageSquare,
  Coins,
  Crown,
  Gift,
  Image,
  MessageSquare,
  Send,
  Sparkles,
  User2,
  Video,
} from "lucide-react"
import ImageDisplay from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useOnborda } from "onborda"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { siteConfig } from "@/app/siteConfig"
import { Navbar } from "@/components/(main)/authentified-navbar"
import { ToggleTheme } from "@/components/(main)/ToggleTheme"
import { AddTokenDialog } from "@/components/billing/addToken"
import { UpgradePlanDialog } from "@/components/billing/upgradePlan"
import { UserProfileMobile } from "@/components/navigation/UserProfile"
import JetonCounter from "@/components/pandorra/jeton-counter"
import { TaskForm } from "@/components/task/task-dialog"
import { Tooltip } from "@/components/tremor/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useIsSidebar } from "@/hooks/use-is-sidebar"
import { useUser } from "@/hooks/use-user"
import { cn, cx, focusRing } from "@/lib/utils"
import { RiHome2Line } from "@remixicon/react"

import MobileSidebar from "./MobileSidebar"

const navigation = [
  { name: "Explore", href: "/explore", icon: RiHome2Line, id: "tour1-step1" },
  { name: "Profile", href: "/profile", icon: User2, id: "tour1-step2" },
  { name: "Affiliate", href: "/affiliate", icon: Gift, id: "tour1-step3" },
  { name: "Ranking", href: "/ranking", icon: Crown, id: "tour1-step4" },
] as const

const shortcuts = [
  {
    name: "Pandorra Chat",
    href: "/chat",
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
    name: "Video generation",
    href: "/video",
    icon: Video,
    id: "tour1-step10",
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    icon: BotMessageSquare,
    id: "tour1-step9",
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

      <nav
        className={cn(
          "mt-16 hidden duration-200 transition-width lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col",
          isSidebar ? "lg:w-60" : "lg:w-14",
        )}
      >
        <ScrollArea
          className={cn(
            "flex h-screen min-h-screen grow flex-col gap-y-6 p-2 pl-3 pr-0 dark:bg-gray-950",
            "[&>div>div]:!left-0 [&>div>div]:!right-auto",
          )}
        >
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
                        ? "border-2 border-primary bg-gray-100 text-primary dark:bg-gray-900 dark:text-primary"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                      "text-md flex w-full items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                      isSidebar ? "" : "w-fit gap-x-0",
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
              <UpgradePlanDialog>
                <li id="tour1-step5" className="w-full cursor-pointer">
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
                        <span className="sr-only">{t("Upgrade plan")}</span>
                      </Tooltip>
                    )}
                  </div>
                </li>
              </UpgradePlanDialog>
              <AddTokenDialog>
                <li id="tour1-step6" className="w-full cursor-pointer">
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
                      <Tooltip content={t("Add more tokens")} side="right">
                        <span className="sr-only">{t("Add more tokens")}</span>
                      </Tooltip>
                    )}
                  </div>
                </li>
              </AddTokenDialog>
              <TaskForm>
                <li className="w-full cursor-pointer">
                  <div
                    className={cx(
                      "w-full text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                      "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                      focusRing,
                    )}
                  >
                    <Send
                      className={`shrink-0 duration-200 transition-size ${isSidebar ? "size-5" : "size-6"}`}
                      aria-hidden="true"
                    />

                    {isSidebar ? (
                      t("Feedback")
                    ) : (
                      <Tooltip content={t("Feedback")} side="right">
                        <span className="sr-only">{t("Feedback")}</span>
                      </Tooltip>
                    )}
                  </div>
                </li>
              </TaskForm>
            </ul>
            <div>
              {isSidebar ? (
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
                          ? "border-2 border-primary bg-gray-100 text-primary dark:bg-gray-900 dark:text-primary"
                          : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                        "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                        isSidebar ? "" : "w-fit gap-x-0",
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
            </div>
          </nav>
          <div
            className={cn(
              "mt-10 min-w-56 transition-opacity duration-200",
              isSidebar ? "pb-24 opacity-100" : "opacity-0",
            )}
          >
            <Card className="w-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
              <CardHeader className="space-y-1">
                <CardTitle className="text-center text-2xl font-bold">
                  {user?.plan === "Free"
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
                {user?.plan === "Free" ? (
                  <UpgradePlanDialog>
                    <Button className="w-full">{t(`Upgrade Now`)}</Button>
                  </UpgradePlanDialog>
                ) : (
                  <AddTokenDialog>
                    <Button className="w-full">{t(`Add credits`)}</Button>
                  </AddTokenDialog>
                )}
              </CardFooter>
            </Card>
          </div>
          <ScrollBar />
        </ScrollArea>
      </nav>

      {/* top navbar (xs-lg) */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-2 shadow-sm sm:gap-x-6 sm:px-4 lg:hidden dark:border-gray-800 dark:bg-gray-950">
        <Link href={"/explore"}>
          <>
            <ImageDisplay
              src="/logo/logo-ai-white.png"
              alt="logo"
              width={500}
              height={500}
              className={cn(
                "hidden size-[28px] rotate-180 object-contain dark:block",
              )}
            />
            <ImageDisplay
              src="/logo/logo-ai-black.png"
              alt="logo"
              width={500}
              height={500}
              className={cn(
                "size-[28px] rotate-180 object-contain dark:hidden",
              )}
            />
          </>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ToggleTheme />
          <JetonCounter />
          <UserProfileMobile />
          <MobileSidebar />
        </div>
      </div>
    </>
  )
}
