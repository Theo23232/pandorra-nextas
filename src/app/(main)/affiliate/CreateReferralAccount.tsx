import { Loader } from "lucide-react"
import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  createLinkOnBoarding,
  createStripeConnect,
} from "@/actions/stripe.actions"
import { SelectCountry } from "@/components/(main)/SelectCountry"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface CreateReferralProps {
  children: ReactNode
}

export const CreateReferralAccount = (props: CreateReferralProps) => {
  const [isLoading, setisLoading] = useState(false)
  const [country, setCountry] = useState<string>("")
  const [accountLink, setAccountLink] = useState<string>()
  const { t } = useTranslation()
  const { toast } = useToast()
  const handleButtonClick = async () => {
    setisLoading(true)
    try {
      const accountId = await createStripeConnect(country)

      let link
      if (accountId) {
        link = await createLinkOnBoarding(accountId)
      }

      setAccountLink(link)
    } catch (error) {
      toast({
        title: " Error",
        description:
          "There is an unxpected error, please contact us if it persist",
        variant: "error",
        duration: 3000,
      })
    } finally {
      setisLoading(false)
    }
  }

  useEffect(() => {}, [accountLink])

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t(`Create Stripe Connect Account`)}</DialogTitle>
          <DialogDescription>
            {t(
              `To receive payments, you must create a Stripe Connect account. You will receive a link and be redirected to Stripe onBoarding for account setup and verification.`,
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>{t(`Country`)}</Label>
          <SelectCountry onChange={(value) => setCountry(value)} />
        </div>
        {!isLoading ? (
          <Button onClick={() => handleButtonClick()} variant="outline">
            {t(`Create account`)}
          </Button>
        ) : (
          <Button variant="outline">
            <Loader className="animate-spin" />
          </Button>
        )}
        {accountLink && (
          <div className="flex flex-col items-start">
            <p className="mt-2 list-disc text-sm text-zinc-500 dark:text-zinc-400">
              {t(
                `Click on this link to finalize the creation of your account:`,
              )}
            </p>
            <Link href={accountLink}>{t(`Click here`)}</Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
