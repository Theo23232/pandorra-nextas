"use client"

import { Badge } from "@/components/tremor/ui/badge"
import { Card } from "@/components/tremor/ui/card"

export default function RankingsPage() {
  return (
    // <Card className="mx-auto max-w-2xl">
    //   <RankingList />
    // </Card>

    <Card className="mx-auto w-fit">
      <div className="flex w-full max-w-[495px] flex-col items-center justify-center p-6">
        <p className="self-stretch[font-feature-settings:'liga'_off,_'clig'_off] mb-6 self-stretch text-center font-[inter] text-[32px] font-semibold leading-normal tracking-[-1.5px]">
          Ranking Coming Soon!
        </p>
        <p className="mb-8 text-center font-[inter] text-[16px] leading-normal [font-feature-settings:'liga'_off,_'clig'_off]">
          We know you're excited to see the ranking feature, but it will be
          available starting early March. We're working hard to bring you an
          amazing experience and we appreciate your patience!
        </p>
        <Badge>🚀 Stay tuned for the launch</Badge>
      </div>
    </Card>
  )
}
