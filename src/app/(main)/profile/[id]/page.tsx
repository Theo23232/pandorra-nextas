"use client"
import { BadgeCheck } from "lucide-react"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"

import { PublicationsProfile } from "@/app/(main)/profile/[id]/Publications"
import { Card } from "@/components/tremor/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetcher } from "@/lib/utils"

export default function ProfilePage() {
  const searchParams = useSearchParams()

  // Exemple pour récupérer une valeur spécifique
  const userId = searchParams.get("userId")

  const { data: user } = useSWR(`/api/user/search?userId=${userId}`, fetcher)

  if (user)
    return (
      <div className="mx-auto max-w-7xl p-4">
        <div className="flex items-start justify-between">
          <Card className="flex gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarImage
                  src={user.image}
                  alt={user.fullname || user.username}
                />
                <AvatarFallback>
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {user.isEmailVerified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 p-1 text-white">
                  <BadgeCheck className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">
                  {user.fullname || user.username}
                </h1>
                {user.isEmailVerified && (
                  <BadgeCheck className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {user.description ||
                  `User based in ${user.language.toUpperCase()}`}
              </p>
              <div className="flex gap-4 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">
                    {user._count.Generation}
                  </span>
                  <span>Image generation</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">
                    {user._count.Video}
                  </span>
                  <span>Videos</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">
                    {user._count.Publication}
                  </span>
                  <span>Publications</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-2 font-semibold">Account Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium capitalize">{user.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jetons</span>
                <span className="font-medium">{user.jeton}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">
                  {user.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h2 className="mb-2 font-semibold">Preferences</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Theme</span>
                <span className="font-medium capitalize">{user.theme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language</span>
                <span className="font-medium uppercase">{user.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Email Notifications
                </span>
                <span className="font-medium">
                  {user.emailNotification ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <PublicationsProfile userId={user.id} />
      </div>
    )
}
