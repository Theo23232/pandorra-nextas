"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"

import { Badge } from "@/components/tremor/ui/badge"
import { Card } from "@/components/tremor/ui/card"

export default function RankingsPage() {
  const { t } = useTranslation()
  return (
    // <Card className="mx-auto max-w-2xl">
    //   <RankingList />
    // </Card>

    <Card className="mx-auto w-fit">
      <div className="flex w-full max-w-[495px] flex-col items-center justify-center p-6">
        <p className="self-stretch[font-feature-settings:'liga'_off,_'clig'_off] mb-6 self-stretch text-center font-[inter] text-[32px] font-semibold leading-normal tracking-[-1.5px]">
          {t(`Ranking Coming Soon!`)}
        </p>
        <p className="mb-8 text-center font-[inter] text-[16px] font-semibold leading-normal [font-feature-settings:'liga'_off,_'clig'_off]">
          {t(`Be in the top 3 per month and earn up to $3,000!`)}
        </p>
        <p className="mb-8 text-center font-[inter] text-[16px] leading-normal [font-feature-settings:'liga'_off,_'clig'_off]">
          {t(
            `We know you're excited to see the ranking feature, but it will be available starting early March. We're working hard to bring you an amazing experience and we appreciate your patience!`,
          )}
        </p>
        <Badge>
          🚀 {t(`Stay tuned for the launch`)}{" "}
          <Link href={"/news-letter"} className="hidden underline">
            {t(`by subscribing to our newsletter`)}
          </Link>
        </Badge>
      </div>
    </Card>
  )
}
