"use client"
import { useEffect, useState } from "react"

import { DescribeSection } from "@/app/affiliation/DescribeSection"
import { Hero } from "@/app/affiliation/Hero"
import LandingNavbar from "@/components/landing/navbar"

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
      <DescribeSection />
    </div>
  )
}
