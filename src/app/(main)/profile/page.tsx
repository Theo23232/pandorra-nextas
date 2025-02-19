"use client"
import { BadgeCheck } from "lucide-react"
import { redirect, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import useSWR from "swr"

import { PublicationsProfile } from "@/app/(main)/profile/[id]/Publications"
import { Card } from "@/components/tremor/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/hooks/use-user"
import { fetcher } from "@/lib/utils"

export default function ProfilePage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()

  // Exemple pour récupérer une valeur spécifique
  const userId = searchParams?.get("userId")

  const { user, isError } = useUser()
  const { data } = useSWR(`/api/user/search?userId=${userId}`, fetcher)
  if (!userId) {
    if (user) return redirect(`/profile?userId=${user.id}`)
  }
  if (data)
    return (
      <div className="mx-auto max-w-7xl p-4">
        <div className="flex items-start justify-between">
          <Card className="flex gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarImage
                  src={data.image}
                  alt={data.fullname || data.username}
                />
                <AvatarFallback>
                  {data.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {data.isEmailVerified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 p-1 text-white">
                  <BadgeCheck className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">
                  {data.fullname || data.username}
                </h1>
                {data.isEmailVerified && (
                  <BadgeCheck className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {data.description}
              </p>
              <div className="flex gap-4 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">
                    {data._count.Generation}
                  </span>
                  <span>{t(`Image generation`)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">
                    {data._count.Video}
                  </span>
                  <span>{t(`Videos`)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">
                    {data._count.Publication}
                  </span>
                  <span>{t(`Publications`)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <PublicationsProfile userId={data.id} />
      </div>
    )
}
