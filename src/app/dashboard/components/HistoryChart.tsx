"use client"
import { useEffect, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GraphData {
  date: Date
  value: number
}

interface StatGraphProps {
  title: string
  data: {
    week: GraphData[]
    month: GraphData[]
    quarter: GraphData[]
  }
  valuePrefix?: string
  color?: string
}

const formatDate = (date: Date) => {
  const d = new Date(date)
  return d.toLocaleDateString()
}

async function fetchStatsHistory(type: string, period: string) {
  const response = await fetch(
    `/api/dashboard/stats/history?type=${type}&period=${period}`,
  )
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} stats`)
  }
  return response.json()
}

function StatGraph({
  title,
  data,
  valuePrefix = "",
  color = "#8884d8",
}: StatGraphProps) {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("week")

  const formatValue = (value: number) => {
    if (valuePrefix === "$") {
      return `${valuePrefix}${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    }
    return `${valuePrefix}${value.toLocaleString("en-US")}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Tabs defaultValue="week" onValueChange={(v) => setPeriod(v as any)}>
          <TabsList>
            <TabsTrigger value="week">7 jours</TabsTrigger>
            <TabsTrigger value="month">30 jours</TabsTrigger>
            <TabsTrigger value="quarter">90 jours</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data[period]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                interval="preserveStartEnd"
              />
              <YAxis tickFormatter={formatValue} />
              <Tooltip
                formatter={(value: number) => [formatValue(value), "Valeur"]}
                labelFormatter={(label) =>
                  formatDate(new Date(label as string))
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StatsGraphs() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const periods = ["week", "month", "quarter"]
    const fetchAllStats = async () => {
      try {
        const [revenue, subscriptions, signups, activeUsers] =
          await Promise.all([
            Promise.all(
              periods.map((period) => fetchStatsHistory("revenue", period)),
            ),
            Promise.all(
              periods.map((period) =>
                fetchStatsHistory("subscriptions", period),
              ),
            ),
            Promise.all(
              periods.map((period) => fetchStatsHistory("signups", period)),
            ),
            Promise.all(
              periods.map((period) =>
                fetchStatsHistory("active-users", period),
              ),
            ),
          ])

        setData({
          revenue: {
            week: revenue[0],
            month: revenue[1],
            quarter: revenue[2],
          },
          subscriptions: {
            week: subscriptions[0],
            month: subscriptions[1],
            quarter: subscriptions[2],
          },
          signups: {
            week: signups[0],
            month: signups[1],
            quarter: signups[2],
          },
          activeUsers: {
            week: activeUsers[0],
            month: activeUsers[1],
            quarter: activeUsers[2],
          },
        })
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
        setLoading(false)
      }
    }

    fetchAllStats()
  }, [])

  if (loading || !data) {
    return <div>Chargement des graphiques...</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <StatGraph
        title="Revenus"
        data={data.revenue}
        valuePrefix="$"
        color="#22c55e"
      />
      <StatGraph
        title="Abonnements"
        data={data.subscriptions}
        color="#3b82f6"
      />
      <StatGraph title="Inscriptions" data={data.signups} color="#8b5cf6" />
      <StatGraph
        title="Utilisateurs Actifs"
        data={data.activeUsers}
        color="#f43f5e"
      />
    </div>
  )
}
