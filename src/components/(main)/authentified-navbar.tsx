"use client"

import { useOnborda } from "onborda"
import { useEffect, useState } from "react"

import { Logo } from "@/components/logo"
import { UserProfileMobile } from "@/components/navigation/UserProfile"
import JetonCounter from "@/components/pandorra/jeton-counter"
import { useUser } from "@/hooks/use-user"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
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
          default:
            break
        }
      }
    }
  }, [user, startOnborda])

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between bg-white bg-opacity-70 px-2 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-4 dark:bg-gray-950 dark:bg-opacity-75 dark:backdrop-blur-md">
      <Logo />
      <div className="flex items-center gap-1 sm:gap-2">
        <JetonCounter />
        <UserProfileMobile />
      </div>
    </div>
  )
}
