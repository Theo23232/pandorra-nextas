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
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#010101] text-white">
        {/* Loader visible tant que la vidéo n'est pas chargée */}
        {!videoLoaded && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="loader">
              <svg viewBox="0 0 100 100" height="100px" width="100px">
                <defs>
                  <linearGradient
                    y2="0%"
                    x2="100%"
                    y1="0%"
                    x1="0%"
                    id="gradient1"
                  >
                    <stop stopColor="#4f8ef7" offset="0%"></stop>
                    <stop stopColor="#a663cc" offset="50%"></stop>
                    <stop stopColor="#f74f6f" offset="100%"></stop>
                  </linearGradient>
                  <linearGradient
                    y2="0%"
                    x2="100%"
                    y1="0%"
                    x1="0%"
                    id="gradient2"
                  >
                    <stop stopColor="#f7b34f" offset="0%"></stop>
                    <stop stopColor="#5ef7a5" offset="50%"></stop>
                    <stop stopColor="#4f8ef7" offset="100%"></stop>
                  </linearGradient>
                </defs>
                <circle
                  stroke="url(#gradient1)"
                  r="40"
                  cy="50"
                  cx="50"
                  className="loader-circle circle-1"
                ></circle>
                <circle
                  stroke="url(#gradient2)"
                  r="30"
                  cy="50"
                  cx="50"
                  className="loader-circle circle-2"
                ></circle>
              </svg>
            </div>
          </div>
        )}

        {/* Vidéo présente dans le DOM mais invisible tant que non chargée */}
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          src="https://blob.teratany.org/videos/anim_logo.mp4"
          playsInline
          autoPlay
          muted
          onLoadedData={() => setVideoLoaded(true)}
          onEnded={() => setVideoEnded(true)}
        />
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
