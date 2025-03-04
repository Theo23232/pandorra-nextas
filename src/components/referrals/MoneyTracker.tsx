"use client"

import { FormEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import useSWR from "swr"

import { withdrawMoney } from "@/actions/stripe.actions"
import { CreateReferralAccount } from "@/app/(main)/affiliate/CreateReferralAccount"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { fetcher } from "@/lib/utils"
import { User } from "@prisma/client"

export const MoneyTracker = () => {
  const { t } = useTranslation()
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
          setError(t(`Withdrawal failed. Please try again.`))
        }
      }
    } else {
      setError(t(`No account found or amount is zero.`))
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
          ? t(`Amount can't be zero`)
          : t(`Amount can't exceed the current amount`),
      )
    }
  }

  return (
    <div className="mx-auto flex flex-col items-start gap-6">
      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <Card
          id="tour13-step1"
          className={
            "bg-[linear-gradient(325deg,#D6141E_0%,#FF824C_55%,#D6141E_90%)] bg-[280%_auto] shadow-[0px_0px_20px_rgba(255,50,50,0.5),0px_5px_5px_-1px_rgba(255,130,100,0.25),inset_4px_4px_8px_rgba(255,180,150,0.5),inset_-4px_-4px_8px_rgba(214,20,30,0.35)] transition-all duration-700 ease-in-out hover:bg-right-top"
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-white">
              {t(`Total accumulated`)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-white">$ {accumulated}</div>
            <p className="text-xs text-muted-foreground text-white">
              {t(`Lifetime savings`)}
            </p>
          </CardContent>
        </Card>
        <Card id="tour13-step2" className={"primeBg"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-white">
              {t(`Current amount`)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-white">
              $ {currentTotal}
            </div>
            <p className="text-xs text-muted-foreground text-white">
              {t(`Available balance`)}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full max-w-2xl flex-col items-start">
        {isAccountExist === "" && (
          <div className="flex w-full items-center" id="tour13-step3">
            <p>
              {t(
                `You must create an account with Stripe Connect to enable withdrawal.`,
              )}
            </p>
            <CreateReferralAccount>
              <Button variant="link">{t(`Create account`)}</Button>
            </CreateReferralAccount>
          </div>
        )}

        {isAccountExist === "" ? (
          <Card
            className="pointer-events-none w-full opacity-100"
            id="tour13-step4"
          >
            <CardHeader>
              <CardTitle>{t(`Withdraw funds`)}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder={t(`Enter amount to withdraw`)}
                    className="flex-grow"
                    disabled
                  />
                  <Button type="submit" disabled>
                    {t(`Withdraw`)}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  {t(`Withdraw all`)} ($ {currentTotal})
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full opacity-100">
            <CardHeader>
              <CardTitle>{t(`Withdraw funds`)}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="z-40 space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder={t(`Enter amount to withdraw`)}
                    className="flex-grow"
                    value={fundsWithdraw}
                    onChange={(e) => setFundsWithDraw(e.target.value)}
                  />
                  <Button type="submit" onClick={(e) => handleSubmit(e)}>
                    {t(`Withdraw`)}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={(e) => handleWithdrawAll(e)}
                >
                  {t(`Withdraw all`)} ($ {currentTotal})
                </Button>
              </form>
              {error && <p className="mt-2 text-sm text-red-500">{t(error)}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
