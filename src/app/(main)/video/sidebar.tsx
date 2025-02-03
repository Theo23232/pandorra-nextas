/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Card } from "@/components/tremor/ui/card"
import { cx, focusRing } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const isActive = (itemHref: string) => {
    return pathname === itemHref
  }
  return (
    <Card className="sticky top-20 h-fit max-h-[70vh] w-96 overflow-y-auto border-l bg-background p-4">
      <Link
        prefetch={true}
        href={"/video"}
        className={cx(
          isActive("/video")
            ? "bg-gray-100 text-indigo-600 dark:bg-gray-900 dark:text-indigo-400"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
          "text-md flex items-center gap-x-3 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
          focusRing,
        )}
      >
        <span className="i-cus--pol-consistent-character-video inline-flex size-6 items-center justify-center"></span>
        Image to video
      </Link>

      <Link
        prefetch={true}
        href={"/video/text-to-video"}
        className={cx(
          isActive("/video/text-to-video")
            ? "bg-gray-100 text-indigo-600 dark:bg-gray-900 dark:text-indigo-400"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
          "text-md flex items-center gap-x-3 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
          focusRing,
        )}
      >
        <span className="i-cus--pol-text-to-video inline-flex size-6 items-center justify-center"></span>
        Text to video
      </Link>
    </Card>
  )
}
