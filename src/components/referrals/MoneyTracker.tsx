"use client"

import { FormEvent, useEffect, useState } from 'react';
import useSWR from 'swr';

import { withdrawMoney } from '@/actions/stripe.actions';
import { CreateReferralAccount } from '@/app/(main)/affiliate/CreateReferralAccount';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { fetcher } from '@/lib/utils';
import { User } from '@prisma/client';

export const MoneyTracker = () => {
  const { data: user } = useSWR<User>("/api/user/current", fetcher)
  const [isAccountExist, setIsAccountExist] = useState<string>("")
  const [accumulated, setIsAccumulated] = useState<string>("")
  const [currentTotal, setCurrentAmount] = useState<string>("")
  const [fundsWithdraw, setFundsWithDraw] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setIsAccountExist(user.connectStripeId || "")
      setIsAccumulated(user.amountAccumulated)
      setCurrentAmount(user.currentAmount)
    }
  }, [isAccountExist, accumulated, currentTotal, user])

  const handleWithdrawAll = async (e: FormEvent) => {
    e.preventDefault()

    const numericValue = Number(currentTotal)

    if (isAccountExist && numericValue > 0) {
      const accountId = user?.connectStripeId

      if (accountId) {
        try {
          await withdrawMoney(accountId, numericValue).then(() => {
            window.location.reload()
          })
        } catch (error) {
          setError("Withdrawal failed. Please try again.")
        }
      }
    } else {
      setError("No account found or amount is zero.")
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const numericValue = Number(fundsWithdraw.replace(",", "."))
    if (
      numericValue &&
      numericValue > 0 &&
      numericValue <= Number(currentTotal)
    ) {
      const accountId = user?.connectStripeId
      if (accountId) {
        await withdrawMoney(accountId, numericValue).then(() => {
          window.location.reload()
        })
      }
      setError(null)
    } else {
      setError(
        numericValue === 0 || !numericValue
          ? "Amount can't be zero"
          : `Amount can't exceed the current amount`,
      )
    }
  }

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <Card className={"bg-primary"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-white">
              Total accumulated
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-white">$ {accumulated}</div>
            <p className="text-xs text-muted-foreground text-white">
              Lifetime savings
            </p>
          </CardContent>
        </Card>
        <Card className={"bg-primary"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-white">
              Current amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-white">
              $ {currentTotal}
            </div>
            <p className="text-xs text-muted-foreground text-white">
              Available balance
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full max-w-2xl flex-col items-start">
        {isAccountExist === "" && (
          <div className="flex w-full items-center">
            <p>
              You must create an account with Stripe Connect to enable
              withdrawal.
            </p>
            <CreateReferralAccount>
              <Button variant="link">Create account</Button>
            </CreateReferralAccount>
          </div>
        )}

        {isAccountExist === "" ? (
          <Card className="pointer-events-none w-full opacity-100">
            <CardHeader>
              <CardTitle>Withdraw funds</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Enter amount to withdraw"
                    className="flex-grow"
                    disabled
                  />
                  <Button type="submit" disabled>
                    Withdraw
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  Withdraw all ($ {currentTotal})
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="pointer-events-none w-full opacity-100">
            <CardHeader>
              <CardTitle>Withdraw funds</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter amount to withdraw"
                    className="flex-grow"
                    value={fundsWithdraw}
                    onChange={(e) => setFundsWithDraw(e.target.value)}
                  />
                  <Button type="submit" onClick={(e) => handleSubmit(e)}>
                    Withdraw
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={(e) => handleWithdrawAll(e)}
                >
                  Withdraw all ($ {currentTotal})
                </Button>
              </form>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
