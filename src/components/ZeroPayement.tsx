"use client"

import { Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { subscriptionSession } from '@/actions/stripeSessions.action';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useShowZeroPayement } from '@/hooks/use-show-zero-payement';

export default function ZeroDollarVerificationDialog() {
  const { t } = useTranslation()
  const { isShow, hide } = useShowZeroPayement()
  const [isLoading, setIsLoading] = useState(false)

  const handleVerification = async () => {
    setIsLoading(true)
    try {
      await subscriptionSession(
        "Card validation",
        "40 free credits / once",
        0,
        "year",
      )
      hide()
    } catch (error) {
      console.error("Verification failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isShow} onOpenChange={(open) => !open && hide()}>
      <DialogContent className="max-w-md p-6 sm:p-8">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <DialogTitle className="text-center text-xl font-bold sm:text-2xl">
            {t(`Vérification de Sécurité`)}
          </DialogTitle>

          <DialogDescription className="text-center text-sm font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-green-600" />
              {t(`Pas de frais aujourd'hui – Juste une vérification`)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <p className="text-center text-sm text-muted-foreground">
            {t(
              `Vous ne serez pas débité, c'est simplement pour vérifier votre carte et activer vos 40 crédits gratuits. Aucun prélèvement automatique – Vous choisissez si vous passez à un abonnement plus tard.`,
            )}
          </p>

          <div className="rounded-lg border border-green-100 bg-green-50 p-4">
            <p className="flex items-center justify-center text-sm font-medium text-green-700">
              <Lock className="mr-2 h-4 w-4" />
              {t(`Aucun frais – Aucun engagement`)}
            </p>
          </div>

          <Separator />

          <div className="flex justify-center gap-6 text-xs">
            <div className="flex items-center text-muted-foreground">
              <ShieldCheck className="mr-1.5 h-4 w-4 text-green-600" />
              {t(`100% sécurisé avec Stripe`)}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Lock className="mr-1.5 h-4 w-4 text-blue-600" />
              {t(`Zéro engagement`)}
            </div>
          </div>

          <Button
            className="w-full py-6 text-sm font-medium"
            onClick={handleVerification}
            disabled={isLoading}
          >
            {isLoading ? "Vérification en cours..." : t(`Vérifier ma Carte`)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
