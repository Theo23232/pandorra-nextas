"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"

import Bounce from "@/components/animated/uibeats/bounce"
import { Button } from "@/components/tremor/ui/button"

export function Unleash() {
  const { t } = useTranslation()
  return (
    <>
      <div className="relative mt-14 flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="absolute left-1/2 top-1/2 z-10 flex w-full -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center">
          <Bounce className="z-10 flex min-h-64 flex-col items-center justify-center">
            <p className="font-inter max-w-xl text-center text-[64px] font-semibold leading-[68px] tracking-[-2.5px] text-[#FDFDFD] max-sm:mt-8 max-sm:text-[48px]">
              {t(`Unleash Your Creativity Today`)}
            </p>
          </Bounce>

          <Bounce className="flex gap-4">
            <Link href={"/explore"}>
              <Button
                variant={"gradient"}
                className="mr-2 flex h-11 items-center justify-center rounded-full px-6 transition-all ease-in-out"
              >
                {t(`Create for free`)}
              </Button>
            </Link>
            <Link href={"/pricing"}>
              <Button
                variant="ghost"
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-slate-600/50 text-white hover:bg-slate-600/60"
              >
                {t(`View pricing`)}
              </Button>
            </Link>
          </Bounce>
        </div>

        <video
          src="https://blob.teratany.org/videos/unleash.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="left-0 top-0 max-h-[70vh] w-full object-cover"
        ></video>
        <div className="absolute h-full w-full bg-black/30"></div>
        {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#010101]"></div> */}
      </div>
    </>
  )
}
