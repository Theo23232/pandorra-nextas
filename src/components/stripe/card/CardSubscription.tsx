"use client"
import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { accountSettingSession, subscriptionSession } from '@/actions/stripeSessions.action';
import { Button } from '@/components/tremor/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/tremor/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetcher } from '@/lib/utils';
import { User } from '@prisma/client';

interface CardPayementProps {
  identity?: string
  name: string
  price: string
  priceYear?: string
  timelap: string
  timelapYear: string
  desc: string
  interval?: string
  buttonName: string
}

export default function CardSubscription(props: CardPayementProps) {
  const { data: user } = useSWR<User>("/api/user/current", fetcher)
  const [currentPlan, setCurrentPlan] = useState("")

  useEffect(() => {
    if (user) {
      setCurrentPlan(user?.plan!)
    }
  }, [user, currentPlan])

  const handleButtonClick = async () => {
    switch (props.identity) {
      case "Free":
        await accountSettingSession()
        break
      case "WeeklyEco":
        await subscriptionSession(
          "Weekly Eco",
          "Add 250 Tokens per week",
          399,
          "week",
        )
        localStorage.setItem("article", "weekly")
        break
      case "StarterMonthly":
        await subscriptionSession(
          "StarterMonthly",
          "Add 1000 Tokens per month",
          999,
          "month",
        )
        localStorage.setItem("article", "starter")
        break
      case "AdvancedMonthly":
        const advancedPrice = props.interval === "monthly" ? 17200 : 1799
        const advancedInterval = props.interval === "monthly" ? "year" : "month"
        await subscriptionSession(
          "AdvancedMonthly",
          "Add 2500 Tokens per month",
          advancedPrice,
          advancedInterval,
        )
        if (advancedInterval === "year") {
          localStorage.setItem("article", "advancedAnnual")
        } else localStorage.setItem("article", "AdvancedMonthly")
        break
      case "PremiumMonthly":
        const premiumPrice = props.interval === "monthly" ? 31600 : 3299
        const premiumInterval = props.interval === "monthly" ? "year" : "month"
        await subscriptionSession(
          "PremiumMonthly",
          "Add 6000 Tokens per month",
          premiumPrice,
          premiumInterval,
        )
        if (premiumInterval === "year") {
          localStorage.setItem("article", "premiumAnnual")
        } else localStorage.setItem("article", "PremiumMonthly")
        break
      default:
        break
    }
  }

  const formatString = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "_")
  }

  return (
    <Card className="min-w-[356px] max-w-[356px] bg-muted/50 text-black dark:text-white">
      <div className="flex flex-col items-center justify-center">
        {props.name === "Free" || props.name === "Weekly eco" ? (
          <CardTitle className="mb-7"> {formatString(props.name)}</CardTitle>
        ) : (
          <Badge className="mb-4 w-max self-center">
            {formatString(props.name)}
          </Badge>
        )}
        {props.name === "Free" ||
        props.name === "Weekly eco" ||
        props.name === "StarterMonthly" ? (
          <>
            <span className="text-5xl font-bold">{props.price}</span>
            <CardDescription className="text-center">
              {formatString(props.timelap)}
            </CardDescription>
          </>
        ) : (
          <>
            {props.interval === "monthly" ? (
              <span className="text-5xl font-bold"> {props.priceYear}</span>
            ) : (
              <span className="text-5xl font-bold"> {props.price}</span>
            )}
            {props.interval === "monthly" ? (
              <CardDescription className="text-center">
                {formatString(props.timelapYear)}
              </CardDescription>
            ) : (
              <CardDescription className="text-center">
                {formatString(props.timelap)}
              </CardDescription>
            )}
          </>
        )}
      </div>

      <CardContent>
        <ul className="mt-7 space-y-2.5 text-sm">
          <li className="flex space-x-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{formatString(props.desc)}</span>
          </li>
        </ul>
      </CardContent>
      {currentPlan === props.identity ? (
        <Button className="w-full text-white">
          <CheckIcon className="mr-2 mt-0.5 size-6 flex-shrink-0" /> Current
          plan
        </Button>
      ) : (
        <Button
          className="w-full text-black hover:text-black dark:text-white hover:dark:text-white"
          variant="outline"
          onClick={() => handleButtonClick()}
        >
          {formatString(props.buttonName)}
        </Button>
      )}
    </Card>
  )
}
