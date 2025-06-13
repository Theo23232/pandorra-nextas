"use client"

import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { payementSession } from '@/actions/stripeSessions.action';
import Bounce from '@/components/animated/uibeats/bounce';
import { Check } from '@/components/icons/check';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { tokenPricesList } from '@/lib/prices';

export default function AddTokenPage() {
  const { t } = useTranslation()

  return (
    <div className="relative overflow-x-hidden rounded-xl bg-background">
      <div
        id="pricing"
        className="relative my-8 flex flex-col items-center justify-center"
      >
        <Bounce className="font-inter relative text-center text-[64px] font-semibold leading-[68px] text-neutral-900 dark:text-[#FDFDFD]">
          {t(`Add more tokens`)}
        </Bounce>
        <Bounce className="my-6 max-w-[800px] text-center font-medium leading-normal text-neutral-400">
          {t(
            `Purchase the number of credits that match your usage. Credits are only available during the current subscription period. Free users are not allowed to purchase credits.`,
          )}
        </Bounce>
        <div className="relative grid min-h-[424px] w-fit max-w-[1600px] grid-cols-2 items-center justify-center gap-9 pt-8 lg:grid-cols-3">
          {tokenPricesList.map((price) => (
            <Pricing
              creditsCount={price.creditsCount}
              price={price.price}
              isPrime={price.isPrime}
              priceStripe={price.priceStripe}
              key={price.creditsCount}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

type PricingProps = {
  creditsCount: number
  price: number
  priceStripe: number
  isPrime?: boolean
}

const Pricing = (props: PricingProps) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const handleButtonClick = async () => {
    setIsLoading(true)
    if (user?.plan === "Free" || user?.plan === "FreePaid") {
      setIsLoading(false)
      toast({
        title: t("Purchase not allowed"),
        description: t("Free users are not allowed to purchase credits."),
        variant: "error",
      })
      return
    }
    await payementSession(
      `${props.creditsCount} credits`,
      `You are about to buy ${props.creditsCount} credits on Pandorra.ai`,
      props.priceStripe,
    )
    localStorage.setItem("article", `${props.creditsCount}Tokens`)
  }
  if (props.isPrime) {
    return (
      <div
        className="flex min-h-[400px] w-[350px] items-center justify-center rounded-[24px] p-[2px]"
        style={{
          backgroundImage: "url('/priceGradient.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex h-full w-full shrink-0 flex-col items-start gap-[32px] rounded-[24px] p-[25px_32px]">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-neutral-800 dark:text-white">
                {props.creditsCount} {t(`credits`)}
              </p>
            </div>
            <div className="mb-6 mt-8 flex flex-col gap-3">
              <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                <Check className="mr-3" />{" "}
                <p>
                  <span className="font-italic mr-1 font-extrabold">
                    {Math.floor(props.creditsCount / 40)}
                  </span>
                  {t(`Short Video`)} (5 sec)
                </p>
              </div>
              <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                <Check className="mr-3" />{" "}
                <p>
                  <span className="font-italic mr-1 font-extrabold">
                    {Math.floor(props.creditsCount / 80)}
                  </span>
                  {t(`Medium Video`)} (10 sec)
                </p>
              </div>
              <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                <Check className="mr-3" />
                <p>
                  <span className="font-italic mx-0.5 font-extrabold">
                    {Math.floor(props.creditsCount / 4)}
                  </span>{" "}
                  {t(`AI-generated images`)}
                </p>
              </div>
              <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                <Check className="mr-3" /> {t(`Text Generation unlimited`)}
              </div>
              <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                <p className="font-italic mx-0.5 font-extrabold">
                  {Math.floor(props.creditsCount / 60)}
                </p>{" "}
                {t(`minutes`)}
              </div>
            </div>
            <div className="mb-8 flex items-center text-neutral-800 dark:text-white">
              <p className="pt-2 text-[24px]">$</p>
              <p className="text-[36px] font-bold">{props.price}</p>
              <p className="ml-2 pt-2 font-light"></p>
            </div>
            <Button
              variant={"ghost"}
              className="mt-auto w-full bg-white hover:bg-white/80"
              onClick={() => handleButtonClick()}
            >
              {isLoading ? (
                <Loader className="animate-spin text-purple-500" />
              ) : (
                <p className="font-bold text-purple-500">{t(`Add credits`)}</p>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border-[2px] border-[rgba(255,255,255,0.10)] bg-muted p-[25px_32px]">
      <div className="w-full">
        <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-neutral-800 dark:text-white">
          {props.creditsCount} {t(`credits`)}
        </p>

        <div className="mb-6 mt-8 flex flex-col gap-3">
          <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
            <Check className="mr-3" />{" "}
            <p>
              <span className="font-italic mr-1 font-extrabold">
                {Math.floor(props.creditsCount / 40)}
              </span>
              {t(`Short Video`)} (5 sec)
            </p>
          </div>
          <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
            <Check className="mr-3" />{" "}
            <p>
              <span className="font-italic mr-1 font-extrabold">
                {Math.floor(props.creditsCount / 80)}
              </span>
              {t(`Medium Video`)} (10 sec)
            </p>
          </div>
          <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
            <Check className="mr-3" />
            <p>
              <span className="font-italic mx-0.5 font-extrabold">
                {Math.floor(props.creditsCount / 4)}
              </span>{" "}
              {t(`AI-generated images`)}
            </p>
          </div>
          <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
            <Check className="mr-3" /> {t(`Text Generation unlimited`)}
          </div>
          <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
            <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
            <p className="font-italic mx-0.5 font-extrabold">
              {Math.floor(props.creditsCount / 60)}
            </p>{" "}
            {t(`minutes`)}
          </div>
        </div>

        <div className="mb-8 flex items-center text-neutral-800 dark:text-white">
          <p className="pt-2 text-[24px]">$</p>
          <p className="text-[36px] font-bold">{props.price}</p>
          <p className="ml-2 pt-2 font-light"></p>
        </div>
        <Button
          variant={"ghost"}
          className="mt-auto w-full bg-white hover:bg-white/80"
          onClick={() => handleButtonClick()}
        >
          {isLoading ? (
            <Loader className="animate-spin text-purple-500" />
          ) : (
            <p className="font-bold text-purple-500">{t(`Add credits`)}</p>
          )}
        </Button>
      </div>
    </div>
  )
}
