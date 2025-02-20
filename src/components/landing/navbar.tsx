"use client"

import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import Bounce from "@/components/animated/uibeats/bounce"
import { NavigationMenuNavbar } from "@/components/landing/NavigationMenuNavbar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function LandingNavbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [sheetIsOpen, setSheetIsOpen] = useState(false)

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
        <div className="hidden md:flex">
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
        <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="text-white md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="w-full dark">
            <div className="flex w-full flex-col items-center justify-center space-y-4 pt-4">
              <NavigationMenuNavbar />
              <Link href={"/explore"}>
                <Button
                  variant={"gradient"}
                  className="w-full rounded-full px-12 py-2 transition-all ease-in-out"
                >
                  {t(`Get started`)}
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Bounce>
  )
}
