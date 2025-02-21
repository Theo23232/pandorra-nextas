"use client"

import { ArrowDownIcon, Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Bounce from '@/components/animated/uibeats/bounce';
import AnimatedShinyText from '@/components/nyxb/animated-shiny-text';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/nyxb/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

export function Hero() {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useState("")
  const [genType, setGenType] = useState("image")

  const { user } = useUser()

  const handleGenerate = () => {
    if (genType == "image") redirect(`/image/generation?prompt=${prompt}`)
    if (genType == "audio") redirect(`/audio/text-to-speech?prompt=${prompt}`)
    if (genType == "video") redirect(`/video?prompt=${prompt}`)
  }
  return (
    <div className="relative flex h-[90vh] w-full flex-col items-center justify-center overflow-hidden max-sm:mt-16">
      <Bounce className="z-10 flex min-h-64 flex-col items-center justify-center">
        <div
          className={cn(
            "group w-fit rounded-full border border-white/5 bg-neutral-900 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-800",
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 text-neutral-200 transition ease-out hover:text-neutral-400 hover:duration-300 group-hover:scale-105">
            <Sparkles className="mr-2 size-5 transition-transform duration-300 ease-in-out" />
            {t(`Get started for Free!`)}
          </AnimatedShinyText>
        </div>

        <p className="max-w-4xl text-center font-sans text-[102px] font-[600] leading-[108px] tracking-[-5.5px] text-white max-sm:text-[60px]">
          <span className="mr-4 bg-gradient-to-r from-[#CC00FF] to-[#0099FF] bg-clip-text pr-2 text-transparent">
            {t(`Pandorra`)}
          </span>
          {t(`at the service of your creativity`)}
        </p>
        <div className="mt-12 flex h-[60px] w-full max-w-2xl items-center gap-2 rounded-full bg-white p-1 shadow-lg backdrop-blur-sm max-sm:hidden">
          <Select
            defaultValue={genType}
            onValueChange={(value) => setGenType(value)}
          >
            <SelectTrigger className="ml-2 h-11 w-[100px] rounded-full border-0 bg-[#F4F2FE] text-black shadow-none focus:ring-0">
              <SelectValue
                placeholder="Image"
                className="bg-gradient-to-l from-[#9600ff] to-[#00ccff] bg-clip-text text-[102px] font-[600] leading-[108px] tracking-[-7.5px] text-transparent"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">{t(`Image`)}</SelectItem>
              <SelectItem value="video">{t(`Video`)}</SelectItem>
              <SelectItem value="audio">{t(`Audio`)}</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="text-md flex-1 border-0 bg-transparent text-black shadow-none focus-visible:ring-0"
            placeholder="A bridge from a top view"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            variant={"default"}
            onClick={handleGenerate}
            className="hover:shadow-gradient mr-2 flex h-11 rounded-full bg-gradient-to-l from-[#9600ff] to-[#00ccff] px-6 transition-all ease-in-out hover:scale-[1.01] hover:shadow-[0_4px_15px_0] hover:shadow-[#9600ff]/30"
          >
            <Sparkles fill="white" /> {t(`Create for free`)}
          </Button>
        </div>
      </Bounce>
      <video
        src="/assets/hero-video-1.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-0 top-0 hidden w-full lg:block"
      ></video>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#010101] lg:block"></div>

      <div className="absolute bottom-16 z-50 mt-16 flex flex-col items-center justify-center gap-4">
        <ArrowDownIcon className="animated-scroll-indicator text-white" />
      </div>
    </div>
  )
}
