/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import { useState } from "react"

import { Card } from "@/components/tremor/ui/card"

export function Sidebar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card className="h-fit max-h-[80vh] w-96 space-y-2 border-l bg-background p-4">
      <Link
        className="flex items-center gap-4 rounded-xl px-2 py-3 hover:bg-muted"
        href="/image-to-video"
        prefetch={true}
      >
        <span className="i-cus--pol-img-to-video inline-flex size-7 items-center justify-center"></span>
        <div className="whitespace-pre-wrap text-lg font-semibold">
          Image to Video
        </div>
      </Link>
      <Link
        className="flex items-center gap-4 rounded-xl px-2 py-3 hover:bg-muted"
        href="/text-to-video"
        prefetch={true}
      >
        <span className="i-cus--pol-text-to-video inline-flex size-7 items-center justify-center"></span>
        <div className="whitespace-pre-wrap text-lg font-semibold">
          Text to Video
        </div>
      </Link>
    </Card>
  )
}
