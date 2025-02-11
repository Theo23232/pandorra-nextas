"use client"
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CardPayement } from '@/components/stripe/card/CardPayement';
import CardSubscription from '@/components/stripe/card/CardSubscription';
import { CardDescription, CardTitle } from '@/components/tremor/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tremor/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BuyTokenInfo, SubscriptionType } from '@/lib/PaymentType';

export default function RoutePage() {
  const { t } = useTranslation()
  const [isSwitchOn, setIsSwitchOn] = useState(false)

  const [intervalType, setIntervalType] = useState<string>("annual")

  const handleButtonClick = (mode: boolean) => {
    if (!mode) {
      setIntervalType("monthly")
    } else {
      setIntervalType("annual")
    }
    setIsSwitchOn(!mode)
  }
  return (
    <Tabs defaultValue="1" className="max-w-7xl">
      <TabsList>
        <TabsTrigger value="1">{t(`Buy tokens`)}</TabsTrigger>
        <TabsTrigger value="2">{t(`Subscription`)}</TabsTrigger>
      </TabsList>
      <div className="ml-2 mt-4">
        <TabsContent
          value="1"
          className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
        >
          <div className="relative w-full rounded-lg border p-6 text-left shadow-sm">
            <CardTitle>{t(`Buy some token`)}</CardTitle>
            <CardDescription>
              {t(
                `Whatever your status, our offers evolve according to your needs.`,
              )}
            </CardDescription>
            <div className="flex flex-wrap gap-4">
              {BuyTokenInfo.map((tokenOffer) => (
                <CardPayement
                  key={tokenOffer.identity}
                  type={tokenOffer.type}
                  identity={tokenOffer.identity}
                  name={tokenOffer.name}
                  price={tokenOffer.price}
                  desc={tokenOffer.desc}
                  buttonName={tokenOffer.buttonName}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="2"
          className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
        >
          <div className="relative w-full rounded-lg border p-6 text-left shadow-sm">
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Whatever your status, our offers evolve according to your needs.
            </CardDescription>
            <div className="relative mb-4 flex items-center justify-center">
              <Label htmlFor="payment-schedule" className="me-3">
                Monthly
              </Label>
              <Switch
                id="payment-schedule"
                checked={isSwitchOn}
                onCheckedChange={() => handleButtonClick(isSwitchOn)}
              />
              <Label
                htmlFor="payment-schedule"
                className="ms-3 flex items-center justify-center"
              >
                Annual{" "}
                <Badge className="ml-2 w-full p-1 uppercase">
                  Save up to 10%
                </Badge>
              </Label>
            </div>
            <div className="flex flex-wrap gap-4">
              {[...SubscriptionType].reverse().map((subscription) => (
                <CardSubscription
                  key={subscription.identity}
                  identity={subscription.identity}
                  name={subscription.name}
                  price={subscription.price}
                  priceYear={subscription.priceYear}
                  timelap={subscription.timelap}
                  timelapYear={subscription.timelapYear}
                  desc={subscription.desc}
                  buttonName={subscription.buttonName}
                  interval={intervalType}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
