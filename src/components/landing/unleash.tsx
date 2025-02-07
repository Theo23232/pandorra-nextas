"use client"

import Bounce from "@/components/animated/uibeats/bounce"
import { Button } from "@/components/tremor/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function Unleash() {
  return (
    <>
      <AspectRatio
        ratio={16 / 5}
        className="relative mt-14 flex w-full flex-col items-center justify-center overflow-hidden"
      >
        <Bounce className="z-10 flex min-h-64 flex-col items-center justify-center">
          <p className="font-inter text-center text-[64px] font-semibold leading-[68px] tracking-[-2.5px] text-[#FDFDFD]">
            Unleash Your Creativity <br />
            Today
          </p>
        </Bounce>

        <Bounce className="z-10 flex gap-4">
          <button className="flex h-10 items-center justify-center gap-2 rounded-full bg-white px-4 text-black hover:bg-slate-100">
            Create for free
          </button>
          <Button
            variant="ghost"
            className="flex items-center justify-center gap-2 rounded-full bg-slate-600/50 text-white hover:bg-slate-600/60"
          >
            View pricing
          </Button>
        </Bounce>
        <video
          src="/assets/unleash.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 w-full"
        ></video>
        {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-3/4 bg-gradient-to-b from-[#010101]"></div> */}
        {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#010101]"></div> */}
      </AspectRatio>
    </>
  )
}
