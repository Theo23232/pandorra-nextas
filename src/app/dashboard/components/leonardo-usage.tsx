import { Clock, Database, Gauge, Layers } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface LeonardoUsageProps {
  data: {
    user_details: Array<{
      tokenRenewalDate: string | null
      paidTokens: number
      subscriptionTokens: number
      subscriptionGptTokens: number
      subscriptionModelTokens: number
      apiConcurrencySlots: number
      apiPaidTokens: number
      apiSubscriptionTokens: number
      apiPlanTokenRenewalDate: string
    }>
  }
}

export function LeonardoUsageCardAlt({ data }: LeonardoUsageProps) {
  const userDetails = data.user_details[0]
  const renewalDate = userDetails.apiPlanTokenRenewalDate
    ? new Date(userDetails.apiPlanTokenRenewalDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      )
    : "Not scheduled"

  return (
    <Card className="w-full max-w-md overflow-hidden border-2 border-indigo-200">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Leonardo AI</CardTitle>
          <Badge
            variant="outline"
            className="border-indigo-200 bg-indigo-50 text-indigo-700"
          >
            Subscription
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" />
            <span className="font-medium">Token Usage</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">{userDetails.paidTokens}</span>
            <span className="ml-1 text-sm text-muted-foreground">
              / {userDetails.apiSubscriptionTokens}
            </span>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="mb-1 text-xs text-muted-foreground">
              GPT Tokens
            </span>
            <div className="flex items-center">
              <Database className="mr-1 h-4 w-4 text-green-500" />
              <span className="font-semibold">
                {userDetails.subscriptionGptTokens}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="mb-1 text-xs text-muted-foreground">
              Model Tokens
            </span>
            <div className="flex items-center">
              <Database className="mr-1 h-4 w-4 text-blue-500" />
              <span className="font-semibold">
                {userDetails.subscriptionModelTokens}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-indigo-500" />
              <span className="text-sm">API Concurrency</span>
            </div>
            <span className="font-semibold">
              {userDetails.apiConcurrencySlots} slots
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-500" />
              <span className="text-sm">API Paid Tokens</span>
            </div>
            <span className="font-semibold">{userDetails.apiPaidTokens}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" />
              <span className="text-sm">Next Renewal</span>
            </div>
            <span className="text-sm font-medium">{renewalDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
