"use client"
import { Loader, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { subscriptionSession } from '@/actions/stripeSessions.action';
import { Tab, TabContainer, TabPanel, Tabs } from '@/components/animated/animated-tabs';
import Bounce from '@/components/animated/uibeats/bounce';
import { Check } from '@/components/icons/check';
import { Badge } from '@/components/tremor/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';
import { subListVariant, subsList } from '@/lib/prices';
import { cn } from '@/lib/utils';

export default function UpgradePage() {
  const { t } = useTranslation()

  return (
    <div className="relative overflow-x-hidden rounded-xl bg-background">
      <div
        id="pricing"
        className="relative my-8 flex flex-col items-center justify-center"
      >
        <Bounce className="font-inter text-center text-[64px] font-semibold leading-[68px] dark:text-[#FDFDFD]">
          <span>{t(`Upgrade plan`)}</span>
        </Bounce>
        <Bounce className="my-6 flex max-w-4xl flex-col items-center text-center font-medium leading-normal text-neutral-500">
          {t(
            `Choose the plan that fits your creative needs and experience AI-powered content generation like never before. Whether you're just exploring or need professional-grade tools, we have the right plan for you`,
          )}
          <br />
          <span className="mt-4 flex items-center justify-center gap-2">
            <TriangleAlert size={20} />{" "}
            {t(`You can upgrade your plan, but you can't downgrade it`)}
          </span>
        </Bounce>
        <div className="relative flex min-h-[424px] w-full max-w-[1200px] items-center justify-center gap-9">
          <TabContainer className="relative flex flex-col items-center justify-center">
            <Tabs className="mb-8 text-white">
              <Tab value={"small"}>{t(`Small`)}</Tab>
              <Tab value={"monthly"}>{t(`Monthly`)}</Tab>
              <Tab value={"Annually"}>{t(`Annually`)}</Tab>
            </Tabs>
            <TabPanel
              value={"small"}
              className="relative flex justify-between gap-4 max-sm:flex-col"
            >
              <div className="flex min-h-[522px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-muted p-[25px_32px]">
                <div className="">
                  <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-neutral-800 dark:text-white">
                    {t(`Free`)}
                  </p>

                  <div className="mb-6 mt-8 flex flex-col gap-3">
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                      <Check className="mr-3" />
                      <p>
                        <span className="font-italic mx-1 font-extrabold">
                          100
                        </span>{" "}
                        {t(`Credits`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                      <X className="mr-2 size-4" />
                      <p>{t(`Short Video`)}</p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                      <X className="mr-2 size-4" />
                      <p>{t(`Medium Video`)}</p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                      <Check className="mr-3" />
                      <p className="font-italic mx-1 font-extrabold">20</p>{" "}
                      {t(`AI-generated images`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                      <Check className="mr-3" />{" "}
                      {t(`Text Generation unlimited`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
                      <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                      <p className="font-italic mx-1 font-extrabold">1</p>{" "}
                      {t(`minutes`)}
                    </div>
                  </div>

                  <div className="mb-8 flex items-center text-neutral-800 dark:text-white">
                    <p className="pt-2 text-[24px]"></p>
                    <p className="text-[36px] font-bold"></p>
                    <p className="ml-2 pt-2 font-light"></p>
                  </div>
                </div>
              </div>
              <Sub
                creditsCount={350}
                price={5.8}
                isPrime={true}
                title={"Weekly"}
                priceStripe={580}
                frequence={"week"}
                productName="Hebdomadaire"
              />
            </TabPanel>
            <TabPanel
              value={"monthly"}
              className="relative flex justify-between gap-4 max-md:flex-col"
            >
              {subsList.map((price) => (
                <Sub
                  creditsCount={price.creditsCount}
                  price={price.price}
                  isPrime={price.isPrime}
                  title={price.title}
                  priceStripe={price.priceStripe}
                  badge={price.badge}
                  key={price.creditsCount}
                  frequence={"month"}
                  productName={price.productName}
                />
              ))}
            </TabPanel>
            <TabPanel
              value={"Annually"}
              className="relative flex justify-between gap-4 max-md:flex-col"
            >
              {subsList.map((price) => (
                <Sub
                  creditsCount={price.creditsCount * 12}
                  price={price.price * 11}
                  isPrime={price.isPrime}
                  title={price.title}
                  priceStripe={price.priceStripe * 11}
                  badge={price.badge}
                  frequence={"year"}
                  key={price.creditsCount}
                  productName={`${price.productName}Year`}
                />
              ))}
            </TabPanel>
          </TabContainer>
        </div>
      </div>
    </div>
  )
}

type SubProps = {
  creditsCount: number
  price: number
  priceStripe: number
  isPrime?: boolean
  badge?: string
  title: string
  frequence: "month" | "year" | "week"
  productName: string
}

const Sub = (props: SubProps) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()

  const [currentPlan, setCurrentPlan] = useState<String>(user?.plan!)
  const [isUpgradable, setisUpgradable] = useState(false)

  const handleButtonClick = async () => {
    setIsLoading(true)
    await subscriptionSession(
      props.productName,
      `${props.creditsCount} credits / ${t(props.frequence)}`,
      props.priceStripe,
      props.frequence,
    )
  }
  useEffect(() => {
    const current = subListVariant.find(
      (plan) => plan.name === props.productName,
    )
    const userPLan = subListVariant.find((plan) => plan.name === user?.plan)
    if (userPLan && current && userPLan?.index > current?.index) {
      setisUpgradable(false)
    } else setisUpgradable(true)
  }, [])

  return (
    <div
      className={cn(
        "flex min-h-[400px] w-[350px] items-center justify-center rounded-[24px] p-[2px]",
        props.isPrime ? "" : "bg-muted",
      )}
      style={
        props.isPrime
          ? {
              backgroundImage: "url('/priceGradient.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div
        className={cn(
          "flex h-full w-full shrink-0 flex-col items-start gap-[32px] rounded-[24px] p-[25px_32px] dark:bg-[#39517e77]",
        )}
      >
        <div className="w-full">
          <div className="flex items-center justify-between">
            <p
              className={cn(
                "font-inter self-stretch text-[24px] font-bold leading-normal text-neutral-800 dark:text-white",
                props.badge == "Most popular" && "gdt",
              )}
            >
              {t(props.title)}
            </p>
            {props.badge && (
              <Badge
                className={
                  props.isPrime
                    ? "dark:bg-blue-800/50 dark:text-white dark:ring-blue-700/70"
                    : "dark:bg-purple-800/50 dark:text-white dark:ring-purple-700/70"
                }
              >
                {t(props.badge)}
              </Badge>
            )}
          </div>
          <div className="mb-6 mt-8 flex flex-col gap-3">
            <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
              <Check className="mr-3" />
              <p>
                <span className="font-italic mx-1 font-extrabold">
                  {props.creditsCount}
                </span>{" "}
                {t(`Credits`)}
              </p>
            </div>
            <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
              <Check className="mr-3" />{" "}
              <p>
                <span className="font-italic mr-1 font-extrabold">
                  {Math.floor(props.creditsCount / 40)}
                </span>
                {t(`Short Video`)} (5 sec)
              </p>
            </div>
            <div className="font-inter font-norma</span>l flex items-center text-[16px] leading-normal text-neutral-800 dark:text-white">
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
                <span className="font-italic mx-1 font-extrabold">
                  {Math.floor(props.creditsCount / 4)}
                </span>{" "}
                {t(`AI-generated images`)}
              </p>
            </div>
            <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
              <Check className="mr-3" /> {t(`Text Generation unlimited`)}
            </div>
            <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-neutral-800 dark:text-white">
              <Check className="mr-3" />
              <p>
                {t(`AI Voice`)}:{" "}
                <span className="font-italic mx-1 font-extrabold">
                  {Math.floor(props.creditsCount / 60)}
                </span>{" "}
                {t(`minutes`)}
              </p>
            </div>
          </div>
          <div className="mb-8 flex items-center text-neutral-800 dark:text-white">
            <p className="pt-2 text-[24px]">$</p>
            <p className="text-[36px] font-bold">{props.price.toFixed(2)}</p>
            <p className="ml-2 pt-2 font-light">/ {t(props.frequence)}</p>
          </div>
          {currentPlan !== props.productName && isUpgradable ? (
            <Button
              variant={"ghost"}
              className={cn("w-full bg-white hover:bg-white/80")}
              onClick={() => handleButtonClick()}
            >
              {isLoading ? (
                <Loader className={cn("animate-spin text-blue-600")} />
              ) : (
                <p className="font-bold text-purple-500">{t(`Choose`)}</p>
              )}
            </Button>
          ) : (
            <Button
              variant={"ghost"}
              className={cn("w-full bg-white hover:bg-white/80")}
            >
              <p className="font-bold text-purple-500">
                {!isUpgradable ? t("Choose") : t(`Current plan`)}
              </p>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
