"use client"
import { useEffect, useState } from "react"

import { Corp } from "@/components/landing/corp"
import { Footer } from "@/components/landing/footer"
import { GalleryMultiple } from "@/components/landing/gallery-multiple"
import { Hero } from "@/components/landing/hero"
import LandingNavbar from "@/components/landing/navbar"
import { UiPresentation } from "@/components/landing/ui-presentation"
import { Unleash } from "@/components/landing/unleash"
import { UnlockPower } from "@/components/landing/unlock-power"

export default function RoutePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])
  return (
    <div className="max-w-screen -z-50 min-h-screen overflow-hidden bg-[#010101]">
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />
      <LandingNavbar />
      <Hero />
      <UiPresentation />
      <Corp />
      <GalleryMultiple />
      <UnlockPower />
      <Unleash />
      <Footer />
      {/*  <ScrollName />
      <Features />
      <Testimonials />
      <LandingGallery />
      <Footer /> */}
    </div>
  )
}
