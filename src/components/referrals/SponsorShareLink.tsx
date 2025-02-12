"use client"

import { Check, ClipboardIcon } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { fetcher } from "@/lib/utils"
import { User } from "@prisma/client"

export const SponsorShareLink = () => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const { data: user } = useSWR<User>("/api/user/current", fetcher)

  const userId = user?.id

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth?referrer=${userId}`,
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 4000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div
      className="mt-4 flex max-w-2xl flex-col items-start gap-6"
      id="tour13-step5"
    >
      <div className="text-start">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t(`Become a referrer`)}
        </h2>
        <p className="mt-1 text-muted-foreground">
          {t(
            `You must share this link to become a sponsor, when your sponsored user makes a subscription you will have 40% of the subscription price`,
          )}
        </p>
      </div>
      <Button
        variant="outline"
        onClick={handleCopy}
        className={copied ? "text-green-600 hover:text-green-600" : ""}
      >
        {copied ? t(`Copied`) : t(`Copy the link`)}
        {copied ? (
          <Check className="ml-2 h-4 w-4" color="green" />
        ) : (
          <ClipboardIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
