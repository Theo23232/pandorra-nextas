"use server"

import { prisma } from "@/prisma"

// Types
interface DateRange {
  start: Date
  end: Date
}

interface RevenueStats {
  value: string
  change: number
  trend: "up" | "down"
}

interface CountStats {
  value: number
  change: number
  trend: "up" | "down"
}

// Fonction utilitaire pour calculer les plages de dates
function getDateRanges() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  return {
    monthly: {
      current: { start: thirtyDaysAgo, end: now },
      previous: { start: sixtyDaysAgo, end: thirtyDaysAgo },
    },
    weekly: {
      current: { start: sevenDaysAgo, end: now },
      previous: { start: fourteenDaysAgo, end: sevenDaysAgo },
    },
  }
}

// Fonction pour calculer le pourcentage de changement
function calculatePercentageChange(previous: number, current: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

// Fonction pour obtenir les revenus
async function getRevenue(dateRange: DateRange): Promise<number> {
  const revenue = await prisma.$queryRaw`
    SELECT COALESCE(SUM(amount), 0) as total FROM (
      SELECT CAST(price AS FLOAT) as amount
      FROM "BuyToken"
      WHERE "createdAt" >= ${dateRange.start} AND "createdAt" < ${dateRange.end}
      UNION ALL
      SELECT CAST(price AS FLOAT) as amount
      FROM "Subscribe"
      WHERE "createdAt" >= ${dateRange.start} AND "createdAt" < ${dateRange.end}
    ) as combined
  `
  return (revenue as any)[0].total
}

async function calculateRevenueStats(): Promise<RevenueStats> {
  const { monthly } = getDateRanges()

  const currentRevenue = await getRevenue(monthly.current)
  const previousRevenue = await getRevenue(monthly.previous)

  const change = calculatePercentageChange(previousRevenue, currentRevenue)

  return {
    value: currentRevenue.toFixed(2),
    change,
    trend: change >= 0 ? "up" : "down",
  }
}

// Fonction pour obtenir les abonnements
async function getSubscriptions(dateRange: DateRange): Promise<number> {
  return await prisma.subscribe.count({
    where: {
      createdAt: {
        gte: dateRange.start,
        lt: dateRange.end,
      },
    },
  })
}

async function calculateSubscriptionStats(): Promise<CountStats> {
  const { monthly } = getDateRanges()

  const currentSubs = await getSubscriptions(monthly.current)
  const previousSubs = await getSubscriptions(monthly.previous)

  const change = calculatePercentageChange(previousSubs, currentSubs)

  return {
    value: currentSubs,
    change,
    trend: change >= 0 ? "up" : "down",
  }
}

// Fonction pour obtenir les inscriptions
async function getSignups(dateRange: DateRange): Promise<number> {
  return await prisma.user.count({
    where: {
      createdAt: {
        gte: dateRange.start,
        lt: dateRange.end,
      },
    },
  })
}

async function calculateSignupStats(): Promise<CountStats> {
  const { monthly } = getDateRanges()

  const currentSignups = await getSignups(monthly.current)
  const previousSignups = await getSignups(monthly.previous)

  const change = calculatePercentageChange(previousSignups, currentSignups)

  return {
    value: currentSignups,
    change,
    trend: change >= 0 ? "up" : "down",
  }
}

// Fonction pour obtenir les utilisateurs actifs
async function getActiveUsers(dateRange: DateRange): Promise<number> {
  const activeUsers = await prisma.userActivity.groupBy({
    by: ["userId"],
    where: {
      timestamp: {
        gte: dateRange.start,
        lt: dateRange.end,
      },
    },
    _count: true,
  })
  return activeUsers.length
}

async function calculateActiveUserStats(): Promise<CountStats> {
  const { weekly } = getDateRanges()

  const currentActive = await getActiveUsers(weekly.current)
  const previousActive = await getActiveUsers(weekly.previous)

  const change = calculatePercentageChange(previousActive, currentActive)

  return {
    value: currentActive,
    change,
    trend: change >= 0 ? "up" : "down",
  }
}

// Fonction principale qui rassemble toutes les statistiques
export async function getDashboardStats() {
  const [revenue, subscriptions, signups, activeUsers] = await Promise.all([
    calculateRevenueStats(),
    calculateSubscriptionStats(),
    calculateSignupStats(),
    calculateActiveUserStats(),
  ])

  return {
    revenue,
    subscriptions,
    signups,
    activeUsers,
  }
}

// Exemple d'utilisation pour une seule statistique
export async function getRevenueStatsOnly() {
  return await calculateRevenueStats()
}

export async function getSubscriptionStatsOnly() {
  return await calculateSubscriptionStats()
}

export async function getSignupStatsOnly() {
  return await calculateSignupStats()
}

export async function getActiveUserStatsOnly() {
  return await calculateActiveUserStats()
}
