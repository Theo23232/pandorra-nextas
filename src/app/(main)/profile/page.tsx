"use client"
import { UserRoundPen } from "lucide-react"
import Link from "next/link"
import { redirect, useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import useSWR from "swr"

import { PublicationsProfile } from "@/app/(main)/profile/[id]/Publications"
import { Card } from "@/components/tremor/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
          <Card className="relative flex gap-3 max-lg:flex-col max-lg:items-center">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                <AvatarImage
                  src={data.image}
                  alt={data.fullname || data.username}
                />
                <AvatarFallback>
                  {data.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 max-lg:items-center">
                <h1 className="text-xl font-semibold">
                  {data.fullname || data.username}
                </h1>
                <Link
                  href={"/settings"}
                  className="max-lg:absolute max-lg:right-2 max-lg:top-2"
                >
                  <Button variant={"ghost"} size={"icon"}>
                    <UserRoundPen />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.description}
              </p>
              <div className="flex gap-4 pt-2 text-sm text-muted-foreground max-lg:grid max-lg:grid-cols-3 max-lg:gap-2">
                <div className="flex items-center gap-1 max-lg:flex-col max-lg:justify-center">
                  <span className="font-semibold text-foreground">
                    {data._count.Generation}
                  </span>
                  <span>{t(`Images`)}</span>
                </div>
                <div className="flex items-center gap-1 max-lg:flex-col max-lg:justify-center">
                  <span className="font-semibold text-foreground">
                    {data._count.Video}
                  </span>
                  <span>{t(`Videos`)}</span>
                </div>
                <div className="flex items-center gap-1 max-lg:flex-col max-lg:justify-center">
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
