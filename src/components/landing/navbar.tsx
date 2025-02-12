"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Bounce from '@/components/animated/uibeats/bounce';
import { NavigationMenuNavbar } from '@/components/landing/NavigationMenuNavbar';
import { Button } from '@/components/ui/button';

export default function LandingNavbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <Bounce
      className={`fixed top-0 z-50 flex w-full items-center justify-center p-4 dark`}
    >
      {scrolled && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black"></div>
      )}
      <div className="relative flex w-full max-w-[1274px] items-center justify-between">
        <a href="/#hero">
          <Image
            src="/logo/logo-full-white.png"
            alt="logo"
            className="h-[40px] w-[176px] object-contain"
            width={1000}
            height={500}
          />
        </a>
        <div className="flex">
          <NavigationMenuNavbar />
          <Link href={"/explore"}>
            <Button
              variant={"gradient"}
              className="mr-2 flex h-11 rounded-full px-6 transition-all ease-in-out"
            >
              {t(`Get started`)}
            </Button>
          </Link>
        </div>
      </div>
    </Bounce>
  )
}
