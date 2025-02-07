import Image from 'next/image';
import Link from 'next/link';

import Bounce from '@/components/animated/uibeats/bounce';
import Ripple from '@/components/nyxb/ripple';

export function Footer() {
  return (
    <div className="relative mb-36 ml-20 flex h-[20vh] w-full items-center justify-center">
      <Bounce className="grid w-full max-w-[1274px] grid-cols-5 gap-4">
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
            Features
          </p>

          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            FX Generation
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Text to speech
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Voice changer
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Dubbing
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Text to image
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Text to video
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            AI assistant
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Talk to AI
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Code generation
          </Link>
        </div>

        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-5 text-[18px] font-medium text-white">
            Company
          </p>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            About Us
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Contact Us
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Pricing
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Community
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Ressources
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Affiliate Program
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Refund Policy
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Privacy Policy
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Terms and Conditions
          </Link>
        </div>
        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-5 text-[18px] font-medium text-white">
            Video Tools{" "}
          </p>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Text to video
          </Link>
          <Link
            href="/"
            className="font-inter mb-2 text-[14px] font-semibold leading-[30px] text-white"
          >
            Image to video
          </Link>
        </div>
        <div className="flex h-full w-full flex-col">
          <p className="font-inter mb-5 text-[18px] font-medium text-white">
            Social
          </p>
        </div>
      </Bounce>
      <Ripple />
    </div>
  )
}
