/* eslint-disable @next/next/no-img-element */
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOnborda } from 'onborda';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { MagicCard } from '@/components/animated/magic-ui/magic-card';
import { TextToFX } from '@/components/icons/TextToFX';
import { TextToSpeech } from '@/components/icons/TextToSpeech';
import { VoiceDubbing } from '@/components/icons/voice-dubbing';
import { VoiceChanger } from '@/components/icons/VoiceChanger';
import { useUser } from '@/hooks/use-user';
import { cx, focusRing } from '@/lib/utils';

export function Sidebar() {
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
      console.log(tourOnboarding)
      if (
        !tourOnboarding.includes("ninthtour") &&
        !tourOnboarding.includes("stop")
      ) {
        startOnborda("ninthtour")
      }
    }
  }, [user, startOnborda])
  return (
    <MagicCard className="sticky top-20 h-fit max-h-[70vh] w-96 overflow-y-auto border-l bg-card p-4">
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
      >
        <VoiceChanger aria-hidden="true" />
        {t(`Voice changer`)}
      </Link>
      <Link
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
      >
        <VoiceDubbing aria-hidden="true" />
        {t(`Dubbing`)}
      </Link>
    </MagicCard>
  )
}
