"use client"
import Image from "next/image"
import { useTranslation } from "react-i18next"

import Bounce from "@/components/animated/uibeats/bounce"
import { Button } from "@/components/ui/button"

export default function BeforeFooter() {
  const { t } = useTranslation()
  return (
    <Bounce className="relative max-lg:mb-32 lg:mt-[280px]">
      <div className="-top-5 w-screen lg:absolute">
        <Image
          src="/assets/affiliation/Mask.png"
          width={1512}
          height={400}
          alt={""}
          className="hidden w-full lg:block"
        ></Image>
      </div>
      <div className="abolsute -left-40 top-0">
        <Image
          src="/assets/affiliation/bluehue.png"
          width={800}
          height={200}
          alt={""}
          className="hidden w-full lg:block"
        ></Image>
        <Bounce className="inset-0 -top-52 flex flex-col items-center justify-center gap-[22px] lg:absolute">
          <p className="font-inter text-[64px] font-semibold text-white max-lg:text-center">
            {t(`Ready to Start Earning`)}
            {/* </span> */}?
          </p>
          <p className="text-center text-[16px] text-white max-lg:mx-2">
            {t(
              `Join thousands of affiliates who are already making money with Pandorra.ai.`,
            )}{" "}
            <br />{" "}
            {t(
              `Start promoting today and turn your audience into a revenue stream!`,
            )}
          </p>
          <p className="text-center text-[16px] text-white">
            🔗
            <span className="mx-2 bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
              {t(`Sign up now`)}
            </span>
            {t(`and get your referral link instantly!`)}
          </p>
          <Button
            className="mt-[10px] px-[60px] py-[14px] text-black"
            style={{
              borderRadius: "37px",
              background:
                "linear-gradient(0deg, #EFEFEF 0%, #EFEFEF 100%), #8645FF",
            }}
          >
            {t(`Join the affiliate program`)}
          </Button>
        </Bounce>
      </div>
    </Bounce>
  )
}
