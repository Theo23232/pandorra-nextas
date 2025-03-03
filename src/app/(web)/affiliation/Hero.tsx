"use client"
import { Clipboard } from "lucide-react"
import { useTranslation } from "react-i18next"

import Bounce from "@/components/animated/uibeats/bounce"
import { Button } from "@/components/ui/button"

/* eslint-disable @next/next/no-img-element */
export const Hero = () => {
  const { t } = useTranslation()
  return (
    <div className="relative flex flex-col items-center bg-[#030014] pb-20">
      <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-[#010101] to-transparent"></div>
      <div className="relative flex flex-col items-center justify-center">
        <img src="/img/affiliate.png" alt="" className="mt-20 max-w-2xl" />

        <Bounce className="flex flex-col items-center justify-center gap-[32px]">
          <p className="font-inter text-center text-[64px] font-semibold leading-[68px] text-[#FDFDFD] max-lg:max-w-[calc(100vw-4rem)] max-lg:text-[60px] max-lg:leading-[60px]">
            {t(`Earn with Pandorra.ai`)} <br />
            <span className="mx-2 bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
              {t(`Join Our Affiliate Program!`)}
            </span>
          </p>
          <p className="w-full max-w-3xl text-center text-[16px] font-medium leading-normal text-neutral-400 max-lg:max-w-[calc(100vw-4rem)]">
            {t(`Share Pandorra.ai with your audience and earn`)}
            <span className="mx-2 bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
              {t(`30% commission on every subscription`)}
            </span>
            {t(
              `purchased through your referral link. Whether you're a content creator, marketer, or AI enthusiast, it's a simple way to monetize your network!`,
            )}
          </p>
          <Button
            className="h-[48px] px-[21px] py-[12px]"
            style={{
              borderRadius: "10px",
              background:
                "linear-gradient(277deg, #BC2EFF -10.29%, #359CFF 109.44%), #8645FF",
              backdropFilter: "200px",
            }}
          >
            <p className="text-[16px]">{t(`Copy my link`)}</p>
            <Clipboard size={10} />
          </Button>
        </Bounce>
      </div>
    </div>
  )
}
