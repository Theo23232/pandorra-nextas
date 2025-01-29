import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"

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

interface CreateReferralProps {
  children: ReactNode
}

export const CreateReferralAccount = (props: CreateReferralProps) => {
  const [email, setEmail] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [accountLink, setAccountLink] = useState<string>()

  const handleButtonClick = async () => {
    const accountId = await createStripeConnect(country)

    let link
    if (accountId) {
      link = await createLinkOnBoarding(accountId)
    }

    setAccountLink(link)
  }

  useEffect(() => {}, [accountLink])

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Stripe Connect Account</DialogTitle>
          <DialogDescription>
            To receive payments, you must create a Stripe Connect account. You
            will receive a link and be redirected to Stripe onBoarding for
            account setup and verification.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>Country</Label>
          <SelectCountry onChange={(value) => setCountry(value)} />
        </div>
        <Button onClick={() => handleButtonClick()} variant="outline">
          Create account
        </Button>
        {accountLink && (
          <div className="flex flex-col items-start">
            <p className="mt-2 list-disc text-sm text-zinc-500 dark:text-zinc-400">
              Click this link to finalize the creation of your account:
            </p>
            <Link href={accountLink}>{accountLink}</Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
