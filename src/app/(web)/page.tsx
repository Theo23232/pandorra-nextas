"use client"
import { redirect } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import FAQ from "@/components/landing/FAQ"
import { Footer } from "@/components/landing/footer"
import { GalleryMultiple } from "@/components/landing/gallery-multiple"
import { Hero } from "@/components/landing/hero"
import LandingNavbar from "@/components/landing/navbar"
import { Pricing } from "@/components/landing/pricing"
import { UiPresentation } from "@/components/landing/ui-presentation"
import { Unleash } from "@/components/landing/unleash"
import { UnlockPower } from "@/components/landing/unlock-power"
import { useUser } from "@/hooks/use-user"

export default function RoutePage() {
  const { user, isError, isLoading: isUserLoading } = useUser()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [videoEnded, setVideoEnded] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Gestion de la vidéo d'intro avec fade-out 1 seconde avant la fin
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current

      const handleLoaded = () => {
        setVideoLoaded(true)
        video.play()
      }

      const handleTimeUpdate = () => {
        if (video.duration - video.currentTime <= 1 && !fadeOut) {
          setFadeOut(true)
        }
      }

      const handleEnded = () => {
        fadeTimerRef.current = setTimeout(() => {
          setVideoEnded(true)
        }, 1000) // Laisse le fade-out s’achever
      }

      video.addEventListener("loadeddata", handleLoaded)
      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("ended", handleEnded)

      return () => {
        video.removeEventListener("loadeddata", handleLoaded)
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("ended", handleEnded)
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
      }
    }
  }, [])

  if (user) {
    return redirect("/explore")
  }

  if (isUserLoading) {
    return <div className=""></div>
  }

  // Affichage de l'écran de chargement avec la vidéo
  if (!videoEnded) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#010101]">
        <div
          className={`h-full w-full transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"}`}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="https://blob.teratany.org/videos/anim_logo.mp4"
            playsInline
            autoPlay
            muted
            onEnded={() => {
              setVideoEnded(true)
            }}
          />
        </div>
      </div>
    )
  }

  // Affichage du contenu principal après la vidéo d'intro
  return (
    <div className="max-w-screen -z-50 min-h-screen overflow-hidden scroll-smooth bg-[#010101] dark">
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />
      <div id="hero"></div>
      <LandingNavbar />
      <Hero />
      <UiPresentation />
      {/* <Corp /> */}
      <GalleryMultiple />
      <UnlockPower />
      <Pricing />
      <FAQ />
      <Unleash />
      <Footer />
    </div>
  )
}
