"use client"

import { Loader, X } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { payementSession } from '@/actions/stripeSessions.action';
import Bounce from '@/components/animated/uibeats/bounce';
import { Check } from '@/components/icons/check';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/tremor/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { tokenPricesList } from '@/lib/prices';

export type addTokenProps = {
  children: ReactNode
}

export const AddTokenDialog = (props: addTokenProps) => {
  const { t } = useTranslation()

  return (
    <Dialog>
      <DialogTrigger className="w-full">{props.children}</DialogTrigger>
      <DialogContent className="relative max-h-[90vh] max-w-[1400px] overflow-x-hidden rounded-xl bg-background dark">
        <div
          id="pricing"
          className="relative my-8 flex flex-col items-center justify-center"
        >
          <div className="absolute bottom-32 right-0 h-[577.161px] w-[1756.387px] flex-shrink-0 rounded-[1756.387px] bg-[rgba(0,153,255,0.6)] blur-[112px]"></div>
          <div className="absolute bottom-32 left-0 h-[577.161px] w-[1756.387px] flex-shrink-0 rounded-[1756.387px] bg-[rgba(204,0,255,0.4)] blur-[112px]"></div>
          <Bounce className="font-inter relative text-center text-[64px] font-semibold leading-[68px] text-[#FDFDFD]">
            {t(`Add more tokens`)}
          </Bounce>
          <Bounce className="my-6 max-w-[800px] text-center font-medium leading-normal text-neutral-400">
            {t(
              `Purchase the number of credits that match your usage. Credits are only available during the current subscription period. Free users are not allowed to purchase credits.`,
            )}
          </Bounce>
          <div className="relative flex min-h-[424px] w-full max-w-[1600px] items-center justify-center gap-9 pt-8">
            <div className="relative flex flex-wrap justify-center gap-4">
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
        <DialogClose>
          <Button
            variant={"ghost"}
            className="absolute right-4 top-4 text-white"
          >
            {" "}
            <X />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
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
    if (user?.plan === "Free") {
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
      <div className="flex min-h-[400px] w-[350px] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#0099FF66] to-[#CC00FF77] p-[1px]">
        <div className="flex h-full w-full shrink-0 flex-col items-start gap-[32px] rounded-[24px] bg-[#39517e77] p-[25px_32px]">
          <div className="">
            <div className="flex items-center justify-between">
              <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                {props.creditsCount} {t(`credits`)}
              </p>
            </div>
            <div className="mb-6 mt-8 flex flex-col gap-3">
              <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                <Check className="mr-3" />{" "}
                <p>
                  {t(`Short Video`)} (5 sec):{" "}
                  <span className="font-italic mx-0.5 font-extrabold">
                    {Math.floor(props.creditsCount / 40)}
                  </span>{" "}
                  {t(`videos`)}
                </p>
              </div>
              <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                <Check className="mr-3" />{" "}
                <p>
                  {t(`Medium Video`)} (10 sec):{" "}
                  <span className="font-italic mx-0.5 font-extrabold">
                    {Math.floor(props.creditsCount / 80)}
                  </span>{" "}
                  {t(`videos`)}
                </p>
              </div>
              <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                <Check className="mr-3" /> {t(`Images`)}:{" "}
                <p>
                  <span className="font-italic mx-0.5 font-extrabold">
                    {Math.floor(props.creditsCount / 5)}
                  </span>{" "}
                  {t(`AI-generated images`)}
                </p>
              </div>
              <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                <Check className="mr-3" /> {t(`Text Generation unlimited`)}
              </div>
              <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                <p className="font-italic mx-0.5 font-extrabold">
                  {Math.floor(props.creditsCount / 60)}
                </p>{" "}
                {t(`minutes`)}
              </div>
            </div>
            <div className="mb-8 flex items-center text-white">
              <p className="pt-2 text-[24px]">$</p>
              <p className="text-[36px] font-bold">{props.price}</p>
              <p className="ml-2 pt-2 font-light"></p>
            </div>
            <Button
              variant={"gradient"}
              className="mt-auto w-full"
              onClick={() => handleButtonClick()}
            >
              {isLoading ? (
                <Loader className="animate-spin text-blue-600" />
              ) : (
                <p className="gdt">{t(`Add credits`)}</p>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
      <div className="">
        <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
          {props.creditsCount} {t(`credits`)}
        </p>

        <div className="mb-6 mt-8 flex flex-col gap-3">
          <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
            <Check className="mr-3" />{" "}
            <p>
              {t(`Short Video`)} (5 sec):{" "}
              <span className="font-italic mx-0.5 font-extrabold">
                {Math.floor(props.creditsCount / 40)}
              </span>{" "}
              {t(`videos`)}
            </p>
          </div>
          <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
            <Check className="mr-3" />{" "}
            <p>
              {t(`Medium Video`)} (10 sec):{" "}
              <span className="font-italic mx-0.5 font-extrabold">
                {Math.floor(props.creditsCount / 80)}
              </span>{" "}
              {t(`videos`)}
            </p>
          </div>
          <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
            <Check className="mr-3" /> {t(`Images`)}:{" "}
            <p>
              <span className="font-italic mx-0.5 font-extrabold">
                {Math.floor(props.creditsCount / 5)}
              </span>{" "}
              {t(`AI-generated images`)}
            </p>
          </div>
          <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
            <Check className="mr-3" /> {t(`Text Generation unlimited`)}
          </div>
          <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
            <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
            <p className="font-italic mx-0.5 font-extrabold">
              {Math.floor(props.creditsCount / 60)}
            </p>{" "}
            {t(`minutes`)}
          </div>
        </div>

        <div className="mb-8 flex items-center text-white">
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
            <Loader className="animate-spin" />
          ) : (
            <p className="">{t(`Add credits`)}</p>
          )}
        </Button>
      </div>
    </div>
  )
}
