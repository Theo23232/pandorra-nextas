"use client"

import { Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const CANCELLATION_REASONS = [
  {
    id: "too_expensive",
    icon: "💰",
  },
  {
    id: "missing_features",
    icon: "🧩",
  },
  {
    id: "found_alternative",
    icon: "🔄",
  },
  {
    id: "not_using_enough",
    icon: "⏱️",
  },
  {
    id: "technical_issues",
    icon: "🛠️",
  },
  {
    id: "other",
    icon: "✏️",
  },
]

interface CancelSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, details: string) => Promise<void>
}

export function CancelSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
}: CancelSubscriptionModalProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [otherDetails, setOtherDetails] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast({
        title: t("Error"),
        description: t("Please select a reason for cancellation"),
        variant: "error",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onConfirm(selectedReason, otherDetails)
      onClose()
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to process your request"),
        variant: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[500px]">
        <DialogHeader className="px-6 pb-2 pt-6">
          <DialogTitle className="text-xl">
            {t("Why are you canceling?")}
          </DialogTitle>
          <DialogDescription>
            {t("Your feedback helps us improve our service.")}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="mb-4 grid grid-cols-2 gap-3">
            {CANCELLATION_REASONS.map((reason) => (
              <div
                key={reason.id}
                onClick={() => setSelectedReason(reason.id)}
                className={cn(
                  "flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all",
                  "hover:bg-muted/50",
                  selectedReason === reason.id
                    ? "border-primary bg-primary/5"
                    : "border-border",
                )}
              >
                <div className="mr-3 text-xl">{reason.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t(`${reason.id}`)}</p>
                </div>
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    selectedReason === reason.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground",
                  )}
                >
                  {selectedReason === reason.id && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-sm font-medium">
              {t("Please provide more details")}
            </Label>
            <Textarea
              id="details"
              value={otherDetails}
              onChange={(e) => setOtherDetails(e.target.value)}
              placeholder={t("Tell us more about why you're canceling...")}
              className="min-h-[100px] resize-none focus-visible:ring-primary"
            />
          </div>
        </div>

        <DialogFooter className="bg-muted/30 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedReason}
          >
            {isSubmitting ? t("Submitting...") : t("Submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
