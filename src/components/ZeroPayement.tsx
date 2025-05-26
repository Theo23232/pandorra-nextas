"use client"

import { CreditCard, Lock, ShieldCheck, Zap } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { AddTokenDialog } from "@/components/billing/addToken"
import { UpgradePlanDialog } from "@/components/billing/upgradePlan"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useShowZeroPayement } from "@/hooks/use-show-zero-payement"
import { useUser } from "@/hooks/use-user"

export default function SubscriptionDialog() {
  const { t } = useTranslation()
  const { user } = useUser()
  const { isShow, hide } = useShowZeroPayement()
  const [isLoading, setIsLoading] = useState(false)

  const isFreeUser = user?.plan === "Free"

  return (
    <Dialog open={isShow} onOpenChange={(open) => !open && hide()}>
      <DialogContent className="max-h-[95vh] max-w-md p-6 py-4 sm:p-8">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-center">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                isFreeUser ? "bg-blue-50" : "bg-orange-50"
              }`}
            >
              {isFreeUser ? (
                <CreditCard className="h-8 w-8 text-blue-600" />
              ) : (
                <Zap className="h-8 w-8 text-orange-600" />
              )}
            </div>
          </div>

          <DialogTitle className="text-center text-xl font-bold sm:text-2xl">
            {isFreeUser
              ? t("Upgrade to a higher plan")
              : t("Insufficient tokens")}
          </DialogTitle>

          <DialogDescription className="text-center text-sm font-medium">
            <span className="inline-flex items-center gap-1.5">
              {isFreeUser ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  {t(`Unlock more generations`)}
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-orange-600" />
                  {t(`Recharge your tokens to continue`)}
                </>
              )}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <p className="whitespace-pre-line text-sm text-muted-foreground">
            {isFreeUser
              ? t(
                  `You have reached the generation limit of the free plan. Upgrade to a higher plan to unlock more generations and access all features.`,
                )
              : t(
                  "Your tokens are insufficient to perform this generation. Recharge your account to continue using our services.",
                )}
          </p>

          <div
            className={`rounded-lg border p-4 ${
              isFreeUser
                ? "border-blue-100 bg-blue-50"
                : "border-orange-100 bg-orange-50"
            }`}
          >
            <p
              className={`flex items-center justify-center text-sm font-medium ${
                isFreeUser ? "text-blue-700" : "text-orange-700"
              }`}
            >
              {isFreeUser ? (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t(`More generations with a paid plan`)}
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  {t(`Quickly recharge your tokens`)}
                </>
              )}
            </p>
          </div>

          <Separator />

          <div className="flex justify-center gap-6 text-xs">
            <div className="flex items-center text-muted-foreground">
              <ShieldCheck className="mr-1.5 h-4 w-4 text-green-600" />
              {t(`100% secure with Stripe`)}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Lock className="mr-1.5 h-4 w-4 text-blue-600" />
              {t(`Secure payment`)}
            </div>
          </div>

          {isFreeUser ? (
            <UpgradePlanDialog>
              <Button
                className="w-full py-6 text-sm font-medium"
                disabled={isLoading}
              >
                {t(`Upgrade plan`)}
              </Button>
            </UpgradePlanDialog>
          ) : (
            <AddTokenDialog>
              <Button
                className="w-full py-6 text-sm font-medium"
                disabled={isLoading}
              >
                {t(`Add more tokens`)}
              </Button>
            </AddTokenDialog>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
