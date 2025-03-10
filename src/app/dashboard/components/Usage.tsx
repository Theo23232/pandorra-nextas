import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export const Usage = async () => {
  let elevenlabsUsage
  let leonardoUsage

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
    <div className="grid gap-6 pb-6 md:grid-cols-2">
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
                {leonardoData?.subscriptionTokens || 0}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Paid Tokens</p>
              <p className="text-2xl font-bold">
                {leonardoData?.paidTokens || 0}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">API Paid Tokens</p>
              <p className="text-2xl font-bold">
                {leonardoData?.apiPaidTokens || 0}
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
    </div>
  )
}
