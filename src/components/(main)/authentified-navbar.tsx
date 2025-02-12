"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import Link from "next/link"
import { useOnborda } from "onborda"
import { useEffect } from "react"

import { Logo } from "@/components/logo"
import { UserProfileMobile } from "@/components/navigation/UserProfile"
import JetonCounter from "@/components/pandorra/jeton-counter"
import { useIsSidebar } from "@/hooks/use-is-sidebar"
import { useUser } from "@/hooks/use-user"

export function Navbar() {
  const { startOnborda } = useOnborda()
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      const tourOnboarding = user.tourOnboarding
      if (tourOnboarding.includes("stop")) {
        return
      }
      if (tourOnboarding.length === 0) {
        startOnborda("firsttour")
      } else {
        const lastTour = tourOnboarding[tourOnboarding.length - 1]
        switch (lastTour) {
          case "firsttour":
            startOnborda("secondtour")
            break
          case "secondtour":
            startOnborda("thirdtour")
            break
          case "thirdtour":
            startOnborda("fourthtour")
            break
          case "fourthtour":
            startOnborda("fifthtour")
            break
          case "fifthtour":
            startOnborda("sixthtour")
            break
          case "sixthtour":
            startOnborda("seventhtour")
            break
          case "seventhtour":
            startOnborda("eighthtour")
            break
          case "eighthtour":
            startOnborda("ninthtour")
            break
          case "ninthtour":
            startOnborda("tenthtour")
            break
          case "tenthtour":
            startOnborda("eleventhtour")
            break
          case "eleventhtour":
            startOnborda("twelfthtour")
            break
          case "twelfthtour":
            startOnborda("thirteenthtour")
            break
          default:
            break
        }
      }
    }
  }, [user, startOnborda])

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between bg-white bg-opacity-70 px-2 backdrop-blur-md sm:gap-x-6 sm:px-4 dark:bg-gray-950 dark:bg-opacity-75 dark:backdrop-blur-md">
      <div className="flex items-center">
        <Link href={"/explore"}>
          <Logo />
        </Link>
        <FloatingButton />
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
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
      className="ml-16 cursor-pointer rounded p-2 hover:bg-accent hover:text-accent-foreground"
      onClick={toggleSidebar}
    >
      {isSidebar ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
    </div>
  )
}
