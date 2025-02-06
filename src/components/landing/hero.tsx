"use client"

import { Sparkles } from "lucide-react"

import AnimatedShinyText from "@/components/nyxb/animated-shiny-text"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/nyxb/select"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <AspectRatio
      ratio={16 / 6}
      className="relative flex w-full flex-col items-center justify-center overflow-hidden"
    >
      <div className="z-10 flex min-h-64 flex-col items-center justify-center">
        <div
          className={cn(
            "group rounded-full border border-white/5 bg-neutral-900 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-800",
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 text-neutral-200 transition ease-out hover:text-neutral-400 hover:duration-300 group-hover:scale-105">
            <Sparkles className="mr-2 size-5 transition-transform duration-300 ease-in-out" />
            Get started for Free!
          </AnimatedShinyText>
        </div>

        <p className="text-center font-sans text-[102px] font-[600] leading-[108px] tracking-[-7.5px] text-white">
          Unlock the Power <br /> of Creativity
        </p>
        <div className="mt-12 flex h-[60px] w-full max-w-2xl items-center gap-2 rounded-full bg-white p-1 shadow-lg backdrop-blur-sm">
          <Select defaultValue="image">
            <SelectTrigger
              className="ml-2 h-11 w-[100px] rounded-full border-0 bg-[#F4F2FE] text-black shadow-none focus:ring-0"
              rounded-full
            >
              <SelectValue
                placeholder="Image"
                className="bg-gradient-to-l from-[#9600ff] to-[#00ccff] bg-clip-text text-[102px] font-[600] leading-[108px] tracking-[-7.5px] text-transparent"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="text-md flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
            placeholder="A bridge from a top view"
          />
          <Button className="hover:shadow-gradient mr-2 h-11 rounded-full bg-gradient-to-l from-[#9600ff] to-[#00ccff] px-6 transition-all ease-in-out hover:scale-[1.01] hover:shadow-[0_4px_15px_0] hover:shadow-[#9600ff]/30">
            <Sparkles fill="white" /> Create for free
          </Button>
        </div>
      </div>
      <video
        src="/assets/hero-video-1.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-0 top-0 w-full"
      ></video>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#010101]"></div>
    </AspectRatio>
  )
}
