"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import Bounce from '@/components/animated/uibeats/bounce';
import Ripple from '@/components/nyxb/ripple';

export function Footer() {
  const { t } = useTranslation()
  return (
    <div className="relative ml-20 flex h-fit min-h-[60vh] w-full items-center justify-center py-24">
      <Ripple />

      <Bounce className="relative grid w-full max-w-[1274px] grid-cols-5 gap-4">
        <div className="flex h-full w-full flex-col">
          <Image
            src="/logo/logo-full-white.png"
            alt="logo"
            width={1000}
            height={500}
            className="h-[39px] w-[173px] object-contain dark:block"
          />
        </div>
        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-5 text-[18px] font-medium text-white">
            {t(`Features`)}
          </p>

          <Link
            href="/audio"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`FX Generation`)}
          </Link>
          <Link
            href="/audio/text-to-speech"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Text to speech`)}
          </Link>
          <Link
            href="/audio/voice-changer"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Voice changer`)}
          </Link>
          <Link
            href="/audio/dubbing"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Dubbing`)}
          </Link>
          <Link
            href="/image/generation"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Text to image`)}
          </Link>
          <Link
            href="/video"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Text to video`)}
          </Link>
          <Link
            href="/assistant"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`AI assistant`)}
          </Link>
          <Link
            href="/ai-talk"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Talk to AI`)}
          </Link>
          <Link
            href="/ai-talk"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Code generation`)}
          </Link>
        </div>

        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-5 text-[18px] font-medium text-white">
            {t(`Company`)}
          </p>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`About Us`)}
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Contact Us`)}
          </Link>
          <Link
            href="/pricing"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Pricing`)}
          </Link>
          <Link
            href="/explore"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Community`)}
          </Link>
          <Link
            href="/affiliate"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Affiliate Program`)}
          </Link>
          <Link
            href="/refund-policy"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Refund Policy`)}
          </Link>
          <Link
            href="/privacy"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Privacy Policy`)}
          </Link>
          <Link
            href="/terms"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Terms and Conditions`)}
          </Link>
        </div>
        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-5 text-[18px] font-medium text-white">
            {t(`Video Tools`)}
          </p>
          <Link
            href="/video"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Text to video`)}
          </Link>
          <Link
            href="/video"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white hover:underline"
          >
            {t(`Image to video`)}
          </Link>
        </div>
        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-5 text-[18px] font-medium text-white">
            {t(`Social`)}
          </p>
        </div>
      </Bounce>
    </div>
  )
}
