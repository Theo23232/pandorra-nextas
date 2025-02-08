"use client"

import Bounce from '@/components/animated/uibeats/bounce';
import { Button } from '@/components/tremor/ui/button';

export function Unleash() {
  return (
    <>
      <div className="relative mt-14 flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute left-1/2 top-1/2 z-10 flex w-full -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center">
          <Bounce className="z-10 flex min-h-64 flex-col items-center justify-center">
            <p className="font-inter text-center text-[64px] font-semibold leading-[68px] tracking-[-2.5px] text-[#FDFDFD]">
              Unleash Your Creativity <br />
              Today
            </p>
          </Bounce>

          <Bounce className="flex gap-4">
            <Button
              variant={"gradient"}
              className="mr-2 flex h-11 items-center justify-center rounded-full px-6 transition-all ease-in-out"
            >
              Create for free
            </Button>
            <Button
              variant="ghost"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-slate-600/50 text-white hover:bg-slate-600/60"
            >
              View pricing
            </Button>
          </Bounce>
        </div>

        <video
          src="/assets/unleash.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="left-0 top-0 max-h-[70vh] w-full object-cover"
        ></video>
        {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-3/4 bg-gradient-to-b from-[#010101]"></div> */}
        {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#010101]"></div> */}
      </div>
    </>
  )
}
