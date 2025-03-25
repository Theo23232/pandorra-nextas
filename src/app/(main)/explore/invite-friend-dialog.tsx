"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export function InviteFriendDialog() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Check if we should show the dialog today
    const shouldShowDialog = () => {
      const lastShown = localStorage.getItem("dialogLastShown")

      if (!lastShown) {
        return true // First time visitor
      }

      const today = new Date().toDateString()
      return lastShown !== today
    }

    // Show dialog if needed
    if (shouldShowDialog()) {
      setOpen(true)
      // Save current date to localStorage
      localStorage.setItem("dialogLastShown", new Date().toDateString())
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-none bg-muted/50 dark sm:max-w-md">
        <Image
          width={500}
          height={800}
          alt=""
          src={"/assets/invite-bg.png"}
          className="absolute h-full w-full"
        />
        <div className="relative flex w-full flex-col items-center justify-center py-4">
          <p className="font-inter mt-12 w-full max-w-80 text-center text-[40px] font-semibold leading-none tracking-[-1.5px] text-white">
            {t(`Refer a Friend & Earn`)}{" "}
            <span className="gdt">{t(`Free Credits`)}</span>
          </p>
          <p className="font-inter mt-6 max-w-80 text-center text-base font-normal leading-normal text-white">
            {t(
              `Invite your friends to join Pandorra.ai and collect free credits at every step. The more you share, the more you earn!`,
            )}
          </p>
          <div className="mt-8 flex h-60 w-full items-center justify-center gap-8 rounded border border-border bg-[#1E1B29] py-6 text-sm text-white">
            <div className="flex h-full flex-col items-center justify-end">
              <div className="flex h-36 flex-col items-center justify-center">
                <Image
                  src={"/assets/gift.png"}
                  width={102}
                  height={112}
                  alt=""
                  className="h-auto w-[51px]"
                />
                <p className="mb-6 mt-4">{t(`Sign Up`)}</p>
              </div>
              {t(`Earn 10 credits`)}
            </div>
            <Separator orientation="vertical" className="h-[calc(100%-48px)]" />
            <div className="flex h-full flex-col items-center justify-end">
              <div className="flex h-36 flex-col items-center justify-center">
                <Image
                  src={"/assets/gift.png"}
                  width={146}
                  height={160}
                  alt=""
                  className="h-auto w-[73px]"
                />
                <p className="mb-6 mt-4 w-[80px] text-center">
                  {t(`Subscribe to a Plan`)}
                </p>
              </div>
              {t(`Earn 50 credits`)}
            </div>
          </div>

          <Link
            href={"/affiliate"}
            className="mt-8 flex h-12 w-full items-center justify-center rounded bg-white font-semibold text-black hover:bg-white/90"
          >
            {t(`Refer now`)}
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
