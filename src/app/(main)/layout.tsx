"use client"

import { redirect } from "next/navigation"
import { Onborda, OnbordaProvider } from "onborda"
import { ReactNode } from "react"

import { RegisterAffiliate } from "@/app/(main)/register-affiliate"
import { Sidebar } from "@/components/(main)/navigation/sidebar"
import { OnboardaCard } from "@/components/onboarda/OnboardaCard"
import { useIsSidebar } from "@/hooks/use-is-sidebar"
import { useUser } from "@/hooks/use-user"
import { tours } from "@/lib/onboarda/steps"

interface RouteLayoutProps {
  children: ReactNode
}

export default function RouteLayout({ children }: RouteLayoutProps) {
  const { user, isLoading, isError } = useUser()
  const { isSidebar } = useIsSidebar()

  if (isLoading) {
    console.log("isLoading ==> ", isLoading)
    return null // Or a loading state
  }

  if (!user || isError) {
    console.log("!user || isError ==> ", !user || isError)
    return redirect("/auth")
  }

  return (
    <OnbordaProvider>
      <Onborda
        steps={tours}
        showOnborda={true}
        shadowRgb="55,48,163"
        shadowOpacity="0.8"
        cardComponent={OnboardaCard}
        cardTransition={{
          duration: 0.8,
          type: "spring",
          bounce: 0.25,
          damping: 10,
          mass: 0.7,
          stiffness: 75,
        }}
      >
        <RegisterAffiliate />
        <Sidebar />
        <main className={`p-8 pr-4 pt-0 ${isSidebar ? "lg:pl-64" : ""}`}>
          {children}
        </main>
      </Onborda>
    </OnbordaProvider>
  )
}
