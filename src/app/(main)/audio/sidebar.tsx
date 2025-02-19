/* eslint-disable @next/next/no-img-element */
"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useOnborda } from "onborda"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { TextToFX } from "@/components/icons/TextToFX"
import { TextToSpeech } from "@/components/icons/TextToSpeech"
import { VoiceChanger } from "@/components/icons/VoiceChanger"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useUser } from "@/hooks/use-user"
import { cx, focusRing } from "@/lib/utils"

export function Sidebar({ onSelect }: { onSelect?: () => void }) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { user } = useUser()
  const { startOnborda } = useOnborda()
  const isActive = (itemHref: string) => {
    return pathname === itemHref
  }

  useEffect(() => {
    if (user) {
      const tourOnboarding = user.tourOnboarding
      if (
        !tourOnboarding.includes("ninthtour") &&
        !tourOnboarding.includes("stop")
      ) {
        startOnborda("ninthtour")
      }
    }
  }, [user, startOnborda])
  return (
    <MagicCard className="sticky top-20 h-fit max-h-[70vh] overflow-y-auto border-l bg-card p-4 sm:w-full lg:w-96">
      <Link
        id="tour9-step1"
        prefetch={true}
        href={"/audio/"}
        className={cx(
          isActive("/audio")
            ? "bg-gray-100 text-primary dark:bg-gray-900 dark:text-primary"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
          "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900/50",
          focusRing,
        )}
        onClick={onSelect}
      >
        <TextToFX aria-hidden="true" />
        {t(`FX Generation`)}
      </Link>

      <Link
        id="tour9-step2"
        prefetch={true}
        href={"/audio/text-to-speech"}
        className={cx(
          isActive("/audio/text-to-speech")
            ? "bg-gray-100 text-primary dark:bg-gray-900 dark:text-primary"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
          "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900/50",
          focusRing,
        )}
        onClick={onSelect}
      >
        <TextToSpeech aria-hidden="true" />
        {t(`Text to speech`)}
      </Link>
      <Link
        id="tour9-step3"
        prefetch={true}
        href={"/audio/voice-changer"}
        className={cx(
          isActive("/audio/voice-changer")
            ? "bg-gray-100 text-primary dark:bg-gray-900 dark:text-primary"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
          "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900/50",
          focusRing,
        )}
        onClick={onSelect}
      >
        <VoiceChanger aria-hidden="true" />
        {t(`Voice changer`)}
      </Link>
      {/* <Link
        id="tour9-step4"
        prefetch={true}
        href={"/audio/dubbing"}
        className={cx(
          isActive("/audio/dubbing")
            ? "bg-gray-100 text-primary dark:bg-gray-900 dark:text-primary"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
          "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900/50",
          focusRing,
        )}
        onClick={onSelect}
      >
        <VoiceDubbing aria-hidden="true" />
        {t(`Dubbing`)}
      </Link> */}
    </MagicCard>
  )
}

export function SidebarDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState<Boolean>(false)
  const closeDialog = () => {
    setIsDialogOpen(false)
    setDialogOpen(false)
  }

  const openDialog = () => {
    setIsDialogOpen(true)
    setDialogOpen(true)
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className="fixed bottom-4 right-4 z-50 block rounded-full bg-blue-500 p-2 text-white lg:hidden"
          onClick={openDialog}
        >
          {!dialogOpen ? (
            <PanelLeftClose size={20} />
          ) : (
            <PanelLeftOpen size={20} />
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="w-full bg-transparent">
        <Sidebar onSelect={closeDialog} />
      </DialogContent>
    </Dialog>
  )
}
