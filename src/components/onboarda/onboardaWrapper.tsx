"use client"

import { Onborda, OnbordaProvider } from "onborda"
import { ReactNode, useEffect } from "react"

import { OnboardaCard } from "@/components/onboarda/OnboardaCard"
import { tours } from "@/lib/onboarda/steps"

interface OnboardaWrapperProps {
  children: ReactNode
  showOnborda?: boolean
}

export function OnboardaWrapper({
  children,
  showOnborda = false,
}: OnboardaWrapperProps) {
  // Lock scrolling when onboarding is active
  useEffect(() => {
    if (!showOnborda) return

    // Store original body style
    const originalStyle = window.getComputedStyle(document.body).overflow

    // Function to check if onboarding is visible
    const checkOnboardaVisible = () => {
      return !!document.querySelector(".onborda-overlay")
    }

    // Create mutation observer to detect when onboarding appears/disappears
    const observer = new MutationObserver(() => {
      if (checkOnboardaVisible()) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = originalStyle
      }
    })

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    // Initial check
    if (checkOnboardaVisible()) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      observer.disconnect()
      document.body.style.overflow = originalStyle
    }
  }, [showOnborda])

  return (
    <OnbordaProvider>
      <Onborda
        steps={tours}
        showOnborda={showOnborda}
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
        {children}
      </Onborda>
    </OnbordaProvider>
  )
}
