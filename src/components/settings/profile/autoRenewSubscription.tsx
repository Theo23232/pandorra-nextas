"use client"
import { Info } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    autoRenewSubscription, getSubscriptionState, saveCancellationReason
} from '@/actions/stripeSessions.action';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSubState } from '@/hooks/use-SubState-store';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';

import { CancelSubscriptionModal } from './cancel-modal';

export const EditRenewSubscription = () => {
  const [isSwitchOn, setIsSwitchOn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const { subStatus, setSubStatus } = useSubState()
  const { toast } = useToast()
  const { user } = useUser()
  const { t } = useTranslation()

  const getCurrentStatus = useCallback(async () => {
    try {
      const currentStatus = await getSubscriptionState()
      setSubStatus(currentStatus || "")
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to fetch subscription status"),
        variant: "error",
      })
    }
  }, [setSubStatus, toast, t])

  useEffect(() => {
    getCurrentStatus()
  }, [getCurrentStatus])

  useEffect(() => {
    if (subStatus === "canceled") {
      setIsSwitchOn(false)
    }
  }, [subStatus])

  const handleSwitchToggle = () => {
    if (isSwitchOn) {
      // If turning off auto-renewal, show the modal
      setShowCancelModal(true)
    } else {
      // If turning on auto-renewal, proceed directly
      handleButtonClick(false)
    }
  }

  const handleButtonClick = async (mode: boolean) => {
    setIsLoading(true)
    try {
      await autoRenewSubscription(mode)
      setIsSwitchOn(!mode)
      await getCurrentStatus()

      toast({
        title: !mode ? t("Auto-renewal enabled") : t("Auto-renewal disabled"),
        description: !mode
          ? t(
              "Your subscription will automatically renew at the end of your billing period.",
            )
          : t(
              "Your subscription will expire at the end of your billing period.",
            ),
      })
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to update subscription settings"),
        variant: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancellationConfirm = async (reason: string, details: string) => {
    // First save the cancellation reason
    await saveCancellationReason(reason, details)

    // Then proceed with disabling auto-renewal
    await handleButtonClick(true)
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t(`Subscription Renewal`)}</CardTitle>
          <CardDescription>
            {t(`Manage your subscription auto-renewal settings`)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="renew" className="text-base font-medium">
                {isSwitchOn
                  ? t(`Automatic renewal is enabled`)
                  : t(`Automatic renewal is disabled`)}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isSwitchOn
                  ? t(
                      `Your subscription will automatically renew at the end of your billing period.`,
                    )
                  : t(
                      `Your subscription will expire at the end of your billing period.`,
                    )}
              </p>
            </div>
            <Switch
              id="renew"
              checked={isSwitchOn}
              onCheckedChange={handleSwitchToggle}
              disabled={
                isLoading || user?.plan === "Free" || user?.plan === "FreePaid"
              }
            />
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
            <Info className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div className="text-sm">
              <p className="mb-1 font-medium">
                {" "}
                {t(`About subscription renewal`)}{" "}
              </p>
              <p className="text-muted-foreground">{t(`When auto-renewal`)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancellationConfirm}
      />
    </>
  )
}
