"use client"
import { redirect } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import AuthForm from "@/components/authentication/AuthForm"
import { useUser } from "@/hooks/use-user"
import { getRandomNumber } from "@/lib/utils"

export const Content = () => {
  const [imageUrl, setImageUrl] = useState("")
  const [referrerId, setReferrerId] = useState("")

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.href
      const url = new URL(pathname)
      const refId = url.searchParams.get("referrer") || ""
      localStorage.setItem("referrerId", refId)
      setReferrerId(refId)
    }

    const imageId = getRandomNumber(1, 14)
    setImageUrl(`/img/image${imageId}.webp`)
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
          src="/anim_logo.mp4"
          playsInline
          autoPlay
          muted
          onLoadedData={() => setVideoLoaded(true)}
          onEnded={() => setVideoEnded(true)}
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 bg-background dark max-lg:grid-cols-1">
      <div className="flex h-screen w-[50vw] items-center justify-center max-lg:w-full">
        <AuthForm />
      </div>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          className="hidden h-screen w-[50vw] object-cover lg:block"
          alt={"Background generated by AI"}
        />
      )}
    </div>
  )
}
