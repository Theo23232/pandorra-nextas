"use client"
import { useOnborda } from "onborda"
import { useEffect } from "react"

import { MoneyTracker } from "@/components/referrals/MoneyTracker"
import { SponsorShareLink } from "@/components/referrals/SponsorShareLink"
import { Card } from "@/components/tremor/ui/card"
import { useUser } from "@/hooks/use-user"

export default function Page() {
  const { user } = useUser()
  const { startOnborda } = useOnborda()

  useEffect(() => {
    if (user) {
      const tourOnboarding = user.tourOnboarding
      console.log(tourOnboarding)
      if (
        !tourOnboarding.includes("thirteenthtour") &&
        !tourOnboarding.includes("stop")
      ) {
        startOnborda("thirteenthtour")
      }
    }
  }, [user, startOnborda])
  return (
    <Card className="w-fit">
      <MoneyTracker />
      <SponsorShareLink />
    </Card>
  )
}
