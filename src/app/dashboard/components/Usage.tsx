import { formatDistanceToNow } from "date-fns"
import { CreditCard, Tag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { prisma } from "@/prisma"

type CombinedTransaction = {
  id: string
  type: "BuyToken" | "Subscribe"
  userId: string
  username: string
  email: string
  image: string
  amount?: number
  plan?: string
  price: number
  createdAt: Date
}

export const Usage = async () => {
  let elevenlabsUsage
  let leonardoUsage
  let userTransactionStat

  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/user/subscription",
      {
        method: "GET",
        headers: {
          "xi-api-key": "sk_df497f9499812106f628cbb88038bc9061db664acab03e70",
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status} - ${response.statusText}`)
    }

    elevenlabsUsage = await response.json()
    console.log("Consommation ElevenLabs :", elevenlabsUsage)
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error)
  }

  try {
    const response = await fetch("https://cloud.leonardo.ai/api/rest/v1/me", {
      method: "GET",
      headers: {
        authorization: "Bearer c730433c-957b-429a-b2d3-d0ac5f128ba8",
        "Content-Type": "application/json",
        accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status} - ${response.statusText}`)
    }

    leonardoUsage = await response.json()
    console.log("Consommation leonardo :", leonardoUsage)
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error)
  }

  try {
    // Récupération des BuyToken avec les infos utilisateur
    const buyTokens = await prisma.buyToken.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // Récupération des Subscribe avec les infos utilisateur
    const subscriptions = await prisma.subscribe.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // Transformation des BuyToken en format unifié
    const formattedBuyTokens: CombinedTransaction[] = buyTokens.map(
      (token) => ({
        id: token.id,
        type: "BuyToken" as const,
        userId: token.userId,
        username: token.user.username,
        email: token.user.email,
        image: token.user.image,
        amount: token.amount,
        price: token.price,
        createdAt: token.createdAt,
      }),
    )

    // Transformation des Subscribe en format unifié
    const formattedSubscriptions: CombinedTransaction[] = subscriptions.map(
      (sub) => ({
        id: sub.id,
        type: "Subscribe" as const,
        userId: sub.userId,
        username: sub.user.username,
        email: sub.user.email,
        image: sub.user.image,
        plan: sub.plan,
        price: sub.price,
        createdAt: sub.createdAt,
      }),
    )

    // Combinaison des deux listes
    const combinedList = [...formattedBuyTokens, ...formattedSubscriptions]

    // Tri par date de création (du plus récent au plus ancien)
    combinedList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    userTransactionStat = combinedList
  } catch (error) {}

  // Calculate percentage for ElevenLabs
  const characterPercentage = elevenlabsUsage
    ? Math.round(
        (elevenlabsUsage.character_count / elevenlabsUsage.character_limit) *
          100,
      )
    : 0

  // Format date for ElevenLabs
  const nextResetDate = elevenlabsUsage
    ? new Date(
        elevenlabsUsage.next_character_count_reset_unix * 1000,
      ).toLocaleDateString()
    : ""

  // Leonardo data
  const leonardoData = leonardoUsage?.user_details?.[0]
  const totalLeonardoTokens = leonardoData
    ? leonardoData.paidTokens + leonardoData.subscriptionTokens
    : 0
  const apiRenewalDate = leonardoData?.apiPlanTokenRenewalDate
    ? new Date(leonardoData.apiPlanTokenRenewalDate).toLocaleDateString()
    : ""

  return (
    <div className="grid gap-6 pb-6 md:grid-cols-3">
      {/* ElevenLabs Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>ElevenLabs Usage</CardTitle>
          <CardDescription>
            {elevenlabsUsage?.tier
              ? `Plan: ${elevenlabsUsage.tier.charAt(0).toUpperCase() + elevenlabsUsage.tier.slice(1)}`
              : "Loading..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium">Character Usage</span>
              <span className="text-sm font-medium">
                {characterPercentage}%
              </span>
            </div>
            <Progress value={characterPercentage} className="h-2" />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>
                {elevenlabsUsage?.character_count.toLocaleString()} used
              </span>
              <span>
                {elevenlabsUsage?.character_limit.toLocaleString()} total
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Next Reset</p>
            <p className="text-sm">{nextResetDate}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Subscription Status</p>
            <div className="mt-1 flex items-center">
              <div
                className={`mr-2 h-3 w-3 rounded-full ${elevenlabsUsage?.status === "active" ? "bg-green-500" : "bg-yellow-500"}`}
              ></div>
              <p className="text-sm capitalize">{elevenlabsUsage?.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leonardo Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Leonardo.ai Usage</CardTitle>
          <CardDescription>API and Subscription Details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Subscription Tokens</p>
              <p className="text-2xl font-bold">
                {leonardoData?.apiSubscriptionTokens || 0}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">API Concurrency Slots</p>
              <p className="text-2xl font-bold">
                {leonardoData?.apiConcurrencySlots || 0}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">API Token Renewal Date</p>
            <p className="text-sm">{apiRenewalDate}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="max-h-[300px] space-y-4 overflow-y-auto border-border">
        <ScrollArea>
          {userTransactionStat.map((transaction) => (
            <Card
              key={transaction.id}
              className="overflow-hidden border-border"
            >
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-medium">{transaction.username}</div>

                  <div className="font-semibold">
                    ${(transaction.price / 100).toFixed(2)}
                  </div>
                </div>

                <div className="mb-2 text-sm text-muted-foreground">
                  {transaction.type === "BuyToken"
                    ? `${transaction.amount} tokens`
                    : `${transaction.plan} plan`}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <Badge
                    variant={
                      transaction.type === "BuyToken"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {transaction.type === "BuyToken" ? (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span>Token</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        <span>Subscription</span>
                      </div>
                    )}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(transaction.createdAt, {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </Card>
    </div>
  )
}
