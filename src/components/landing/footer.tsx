"use client"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "react-i18next"

import Bounce from "@/components/animated/uibeats/bounce"
import Ripple from "@/components/nyxb/ripple"

export function Footer() {
  const { t } = useTranslation()
  return (
    <div className="relative ml-0 flex h-fit min-h-[60vh] w-full items-center justify-center py-12 sm:ml-20 sm:py-24">
      <Ripple />

      <Bounce className="relative grid w-full max-w-[1274px] grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-5 lg:px-8">
        <div className="flex h-full w-full flex-col">
          <Image
            src="/logo/logo-full-white.png"
            alt="logo"
            width={1000}
            height={500}
            className="mb-6 h-[39px] w-[173px] object-contain sm:mb-0 dark:block"
          />
        </div>
        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-3 text-[18px] font-medium text-white">
            {t(`Features`)}
          </p>

          {[
            { href: "/audio", text: "FX Generation" },
            { href: "/audio/text-to-speech", text: "Text to speech" },
            { href: "/audio/voice-changer", text: "Voice changer" },
            { href: "/audio/dubbing", text: "Dubbing" },
            { href: "/image/generation", text: "Text to image" },
            { href: "/video", text: "Text to video" },
            { href: "/assistant", text: "AI assistant" },
            { href: "/ai-talk", text: "Talk to AI" },
            { href: "/ai-talk", text: "Code generation" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
            >
              {t(item.text)}
            </Link>
          ))}
        </div>

        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-3 text-[18px] font-medium text-white">
            {t(`Company`)}
          </p>
          {[
            { href: "/about", text: "About Us" },
            // { href: "/", text: "Contact Us" },
            { href: "/pricing", text: "Pricing" },
            { href: "/explore", text: "Community" },
            { href: "/affiliate", text: "Affiliate Program" },
            { href: "/refund-policy", text: "Refund Policy" },
            { href: "/privacy", text: "Privacy Policy" },
            { href: "/terms", text: "Terms and Conditions" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
            >
              {t(item.text)}
            </Link>
          ))}
        </div>
        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-3 text-[18px] font-medium text-white">
            {t(`Video Tools`)}
          </p>
          {[
            { href: "/video", text: "Text to video" },
            { href: "/video", text: "Image to video" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
            >
              {t(item.text)}
            </Link>
          ))}
        </div>
        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-3 text-[18px] font-medium text-white">
            {t(`Social`)}
          </p>
          {/* Add social media links here */}
        </div>
      </Bounce>
    </div>
  )
}
