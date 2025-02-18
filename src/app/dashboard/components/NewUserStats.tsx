"use client"

import { TrendingUp } from "lucide-react"
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import useSWR from "swr"

import { UserStats } from "@/app/api/dashboard/stats/newuserstats/route"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetcher } from "@/lib/utils"

const chartConfig = {
  visitors: {
    label: "Number of users",
  },
  userCount: {
    label: "New users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function NewUserStats() {
  const { data: userStat } = useSWR<UserStats>(
    "/api/dashboard/stats/newuserstats",
    fetcher,
  )

  const [timeRange, setTimeRange] = React.useState("90d")

  if (userStat) {
    const filteredData = userStat.monthlyStats.filter((item) => {
      const date = new Date(item.date)
      const referenceDate = new Date()
      let daysToSubtract = 90
      if (timeRange === "30d") {
        daysToSubtract = 30
      } else if (timeRange === "7d") {
        daysToSubtract = 7
      }
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate
    })

    return (
      <MagicCard>
        <Card className="w-full bg-transparent">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>
                <div className="text-md flex items-center gap-2 font-medium leading-none">
                  Nouveaux utilisateurs en hausse de{" "}
                  {userStat.newUsersPercentage.toFixed(2)}% ce mois-ci{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
              </CardTitle>
              <CardDescription>
                Affichage du total des visiteurs des 3 derniers mois
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Sélectionner une période"
              >
                <SelectValue placeholder="3 derniers mois" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  3 derniers mois
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  30 derniers jours
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  7 derniers jours
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient
                    id="filluserCount"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-userCount)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-userCount)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="userCount"
                  type="natural"
                  fill="url(#filluserCount)"
                  stroke="var(--color-userCount)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </MagicCard>
    )
  }
}
