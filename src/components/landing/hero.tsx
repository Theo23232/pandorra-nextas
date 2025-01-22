"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRightIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

import { AnimatedShinyText } from "@/components/animated/magic-ui/animated-shiny-text"
import { HeroVideoDialog } from "@/components/animated/magic-ui/hero-video-dialog"
import { LineShadowText } from "@/components/animated/magic-ui/line-shadow-text"
import { Particles } from "@/components/animated/magic-ui/particles"
import { TextAnimate } from "@/components/animated/magic-ui/text-animate"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const videoDivRef = useRef<HTMLDivElement | null>(null)
  const { resolvedTheme } = useTheme()
  const [color, setColor] = useState("#ffffff")
  const theme = useTheme()
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black"

  useEffect(() => {
    if (videoDivRef.current) {
      gsap.fromTo(
        videoDivRef.current,
        { width: "960px" },
        {
          width: "1250px",
          duration: 1,
          scrollTrigger: {
            trigger: videoDivRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        },
      )
    }
  }, [])

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000")
  }, [resolvedTheme])

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-8 px-4 py-8 text-center">
        <div
          className={cn(
            "group w-fit rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Introducing Pandorra.ai</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>

        <h1 className="mr-4 text-balance text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
          <LineShadowText className="italic" shadowColor={shadowColor}>
            Creativity
          </LineShadowText>
          {" unleashed"}
        </h1>
        <TextAnimate duration={0.5} animation="scaleUp" by="text">
          Leverage generative AI with a unique suite of tools to convey your
          ideas to the world.
        </TextAnimate>
      </div>

      <div ref={videoDivRef} className="relative w-[960px] max-w-[90vw]">
        <div className="absolute -inset-2 animate-gradient rounded-full bg-gradient-to-r from-cyan-400 via-blue-600 to-indigo-600 opacity-50 blur-[120px]"></div>
        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="/img/preview.jpeg"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="/img/preview.jpeg"
          thumbnailAlt="Hero Video"
        />
      </div>
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </div>
  )
}
