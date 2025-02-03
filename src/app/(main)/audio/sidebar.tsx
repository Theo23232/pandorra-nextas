/* eslint-disable @next/next/no-img-element */
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { TextToFX } from '@/components/icons/TextToFX';
import { TextToSpeech } from '@/components/icons/TextToSpeech';
import { VoiceChanger } from '@/components/icons/VoiceChanger';
import { Card } from '@/components/tremor/ui/card';
import { cx, focusRing } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname()
  const isActive = (itemHref: string) => {
    return pathname === itemHref
  }
  return (
    <Card className="sticky top-20 h-fit max-h-[70vh] w-96 overflow-y-auto border-l bg-background p-4">
      <Link
        prefetch={true}
        href={"/audio/"}
        className={cx(
          isActive("/audio")
            ? "bg-gray-100 text-indigo-600 dark:bg-gray-900 dark:text-indigo-400"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
          "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
          focusRing,
        )}
      >
        <TextToFX aria-hidden="true" />
        FX Generation
      </Link>

      <Link
        prefetch={true}
        href={"/audio/text-to-speech"}
        className={cx(
          isActive("/audio/text-to-speech")
            ? "bg-gray-100 text-indigo-600 dark:bg-gray-900 dark:text-indigo-400"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
          "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
          focusRing,
        )}
      >
        <TextToSpeech aria-hidden="true" />
        Text to speech
      </Link>
      <Link
        prefetch={true}
        href={"/audio/voice-changer"}
        className={cx(
          isActive("/audio/voice-changer")
            ? "bg-gray-100 text-indigo-600 dark:bg-gray-900 dark:text-indigo-400"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
          "text-md flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
          focusRing,
        )}
      >
        <VoiceChanger aria-hidden="true" />
        Voice changer
      </Link>
    </Card>
  )
}
