import { Clipboard } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

/* eslint-disable @next/next/no-img-element */
export const Hero = () => {
  return (
    <div className="mt-28 flex flex-col items-center">
      <div className="relative">
        <Image
          src="assets/affiliation/_blob_cercle.png"
          alt=""
          width={500}
          height={500}
          className="h-[335px] w-[744px]"
          style={{
            backgroundBlendMode: "hue, normal ",
          }}
        />
        <div className="absolute -bottom-[240px] mt-4 flex flex-col items-center justify-center gap-[32px]">
          <p className="font-inter text-center text-[64px] font-semibold leading-[68px] tracking-[-2.5px] text-[#FDFDFD]">
            Earn with Pandorra.ai – <br />
            Join Our Affiliate Program!
          </p>
          <p className="w-full max-w-[750px] text-center text-[16px] font-thin leading-normal text-[#FDFDFD]">
            Share Pandorra.ai with your audience and earn{" "}
            <span className="font-semibold">
              {" "}
              30% commission on every subscription{" "}
            </span>{" "}
            purchased <br /> through your referral link. Whether you re a
            content creator, marketer, or AI enthusiast, it s a simple <br />{" "}
            way to monetize your network!
          </p>
          <Button
            variant={"default"}
            className="flex items-center rounded-sm bg-[#EAEBFE] text-black hover:bg-[#eeefff]"
          >
            <p className="text-[16px]">Copy my link</p>
            <Clipboard size={10} />
          </Button>
        </div>
      </div>
    </div>
  )
}
