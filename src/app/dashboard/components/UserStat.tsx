"use client"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"

import { MagicCard } from "@/components/animated/magic-ui/magic-card"

interface Stats {
  revenue: { value: string; change: number; trend: "up" | "down" }
  subscriptions: { value: number; change: number; trend: "up" | "down" }
  signups: { value: number; change: number; trend: "up" | "down" }
  activeUsers: { value: number; change: number; trend: "up" | "down" }
}

export default function UserStat() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching stats:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!stats) {
    return <div>Error loading statistics</div>
  }

  return (
    <div className="pb-6 pt-10">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <MagicCard>
          <div className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Revenue
              </p>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-medium sm:text-2xl">
                  ${stats.revenue.value}
                </h3>
                <span
                  className={`flex items-center gap-0.5 ${
                    stats.revenue.trend === "up"
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {stats.revenue.trend === "up" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {Math.abs(stats.revenue.change)}%
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.revenue.change >= 0 ? "+" : ""}
                {stats.revenue.change}% from last month
              </p>
            </div>
          </div>
        </MagicCard>

        <MagicCard>
          <div className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Abonnements
              </p>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-medium sm:text-2xl">
                  +{stats.subscriptions.value}
                </h3>
                <span
                  className={`flex items-center gap-0.5 ${
                    stats.subscriptions.trend === "up"
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {stats.subscriptions.trend === "up" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {Math.abs(stats.subscriptions.change)}%
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.subscriptions.change >= 0 ? "+" : ""}
                {stats.subscriptions.change}% from last month
              </p>
            </div>
          </div>
        </MagicCard>

        <MagicCard>
          <div className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Inscription
              </p>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-medium sm:text-2xl">
                  +{stats.signups.value}
                </h3>
                <span
                  className={`flex items-center gap-0.5 ${
                    stats.signups.trend === "up"
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {stats.signups.trend === "up" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {Math.abs(stats.signups.change)}%
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.signups.change >= 0 ? "+" : ""}
                {stats.signups.change}% from last month
              </p>
            </div>
          </div>
        </MagicCard>

        <MagicCard>
          <div className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Active Users
              </p>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-medium sm:text-2xl">
                  +{stats.activeUsers.value}
                </h3>
                <span
                  className={`flex items-center gap-0.5 ${
                    stats.activeUsers.trend === "up"
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {stats.activeUsers.trend === "up" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {Math.abs(stats.activeUsers.change)}%
                  </span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.activeUsers.change >= 0 ? "+" : ""}
                {stats.activeUsers.change}% from last week
              </p>
            </div>
          </div>
        </MagicCard>
      </div>
    </div>
  )
}
