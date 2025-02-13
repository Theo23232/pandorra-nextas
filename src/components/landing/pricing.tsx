"use client"
import { useTranslation } from "react-i18next"

import { subscriptionSession } from "@/actions/stripeSessions.action"
import {
  Tab,
  TabContainer,
  TabPanel,
  Tabs,
} from "@/components/animated/animated-tabs"
import Bounce from "@/components/animated/uibeats/bounce"
import { Check } from "@/components/icons/check"
import { Button } from "@/components/ui/button"

export const Pricing = () => {
  const { t } = useTranslation()

  const handleButtonClick = async (subscriptionType: string) => {
    switch (subscriptionType) {
      case "Hebdomadaire":
        await subscriptionSession(
          "Hebdomadaire",
          "400 credits/week",
          499,
          "week",
        )
        localStorage.setItem("article", "Hebdomadaire")
        break
      case "CreatorPack":
        await subscriptionSession(
          "CreatorPack",
          "1000 credits/month",
          1299,
          "month",
        )
        localStorage.setItem("article", "CreatorPack")
        break
      case "VisionPro":
        await subscriptionSession(
          "VisionPro",
          "3000 credits/month",
          3699,
          "month",
        )
        localStorage.setItem("article", "VisionPro")
        break
      case "PandorraInfini":
        await subscriptionSession(
          "PandorraInfini",
          "8000 credits/month",
          9199,
          "month",
        )
        localStorage.setItem("article", "PandorraInfini")
        break
      case "CreatorPackYear":
        await subscriptionSession(
          "CreatorPack",
          "1000 credits/month for 1 year",
          14289,
          "year",
        )
        localStorage.setItem("article", "CreatorPackYear")
        break

      case "VisionProYear":
        await subscriptionSession(
          "VisionPro",
          "3000 credits/month for 1 year",
          38499,
          "year",
        )
        localStorage.setItem("article", "VisionProYear")
        break
      case "PandorraInfiniYear":
        await subscriptionSession(
          "PandorraInfini",
          "8000 credits/month",
          98989,
          "year",
        )
        localStorage.setItem("article", "PandorraInfiniYear")
        break
      default:
        break
    }
  }

  return (
    <div
      id="pricing"
      className="relative mt-20 flex flex-col items-center justify-center"
    >
      <div className="absolute bottom-32 right-0 h-[577.161px] w-[1756.387px] flex-shrink-0 rounded-[1756.387px] bg-[rgba(0,153,255,0.6)] blur-[112px]"></div>
      <div className="absolute bottom-32 left-0 h-[577.161px] w-[1756.387px] flex-shrink-0 rounded-[1756.387px] bg-[rgba(204,0,255,0.4)] blur-[112px]"></div>
      <Bounce className="font-inter text-center text-[64px] font-semibold leading-[68px] text-[#FDFDFD]">
        {t(`Unlock the Full Power of`)} <br />
        <span className="bg-gradient-to-r from-[#CC00FF] to-[#0099FF] bg-clip-text px-8 text-transparent">
          Pandorra.ai
        </span>
      </Bounce>
      <Bounce className="my-6 max-w-3xl text-center font-medium leading-normal text-neutral-400">
        {t(
          `Choose the plan that fits your creative needs and experience AI-powered content generation like never before. Whether you're just exploring or need professional-grade tools, we have the right plan for you`,
        )}
      </Bounce>
      <div className="relative flex min-h-[424px] w-full max-w-[1200px] items-center justify-center gap-9 pb-48 pt-8">
        <TabContainer className="relative flex flex-col items-center justify-center">
          <Tabs className="mb-32 text-white">
            <Tab value={"small"}>{t(`Small`)}</Tab>
            <Tab value={"monthly"}>{t(`Monthly`)}</Tab>
            <Tab value={"Annually"}>{t(`Annually`)}</Tab>
          </Tabs>
          <TabPanel
            value={"small"}
            className="relative flex justify-between gap-4"
          >
            <div className="flex min-h-[522px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
              <div className="">
                <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                  {t(`Free`)}
                </p>

                <div className="mb-6 mt-8 flex flex-col gap-3">
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Images`)}:{" "}
                    <p className="font-italic mx-1 font-extrabold">125</p>{" "}
                    {t(`AI-generated images`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Text Generation unlimited`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                    <p className="font-italic mx-1 font-extrabold">125</p>{" "}
                    {t(`minutes`)}
                  </div>
                </div>

                <div className="mb-8 flex items-center text-white">
                  <p className="pt-2 text-[24px]"></p>
                  <p className="text-[36px] font-bold"></p>
                  <p className="ml-2 pt-2 font-light"></p>
                </div>
              </div>
            </div>
            <div className="flex min-h-[522px] w-[350px] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#0099FF66] to-[#CC00FF77] p-[1px]">
              <div className="flex h-full w-full shrink-0 flex-col items-start gap-[32px] rounded-[24px] bg-[#39517e77] p-[25px_32px]">
                <div className="">
                  <div className="flex items-center justify-between">
                    <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                      {t(`Weekly`)}
                    </p>
                  </div>
                  <div className="mb-6 mt-8 flex flex-col gap-3">
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`Short Video`)} (5 sec):{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          10
                        </span>{" "}
                        {t(`videos`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`Medium Video`)} (10 sec):{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          5
                        </span>{" "}
                        {t(`videos`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`Images`)}:{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          80
                        </span>{" "}
                        {t(`AI-generated images`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />{" "}
                      {t(`Text Generation unlimited`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`AI Voice`)}:{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          10
                        </span>{" "}
                        {t(`minutes`)}
                      </p>
                    </div>
                  </div>
                  <div className="mb-8 flex items-center text-white">
                    <p className="pt-2 text-[24px]">€</p>
                    <p className="text-[36px] font-bold">4.99</p>
                    <p className="ml-2 pt-2 font-light">/ {t(`week`)}</p>
                  </div>
                  <Button
                    variant={"gradient"}
                    className="mt-auto w-full"
                    onClick={() => handleButtonClick("Hebdomadaire")}
                  >
                    <p className="">{t(`Choose`)}</p>
                  </Button>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel
            value={"monthly"}
            className="relative flex justify-between gap-4"
          >
            <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
              <div className="">
                <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                  {t(`Creator Pack`)}
                </p>

                <div className="mb-6 mt-8 flex flex-col gap-3">
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      <span className="font-italic mx-1 font-extrabold">
                        1000
                      </span>{" "}
                      {t(`Credits`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {" "}
                      {t(`Short Video`)} (5 sec):{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        25
                      </span>{" "}
                      {t(`videos`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`Medium Video`)} (10 sec):{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        12
                      </span>{" "}
                      {t(`videos`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Images`)}:{" "}
                    <p className="font-italic mx-1 font-extrabold">200</p>{" "}
                    {t(`AI-generated images`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Text Generation unlimited`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`AI Voice`)}:{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        25
                      </span>{" "}
                      {t(`minutes`)}
                    </p>
                  </div>
                </div>

                <div className="mb-8 flex items-center text-white">
                  <p className="pt-2 text-[24px]">€</p>
                  <p className="text-[36px] font-bold">12.99</p>
                  <p className="ml-2 pt-2 font-light">/ {t(`month`)}</p>
                </div>
                <Button
                  variant={"ghost"}
                  className="w-full bg-white hover:bg-white/80"
                  onClick={() => handleButtonClick("CreatorPack")}
                >
                  <p className="gdt">{t(`Choose`)}</p>
                </Button>
              </div>
            </div>
            <div className="flex min-h-[400px] w-[350px] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#0099FF66] to-[#CC00FF77] p-[1px]">
              <div className="flex h-full w-full shrink-0 flex-col items-start gap-[32px] rounded-[24px] bg-[#39517e77] p-[25px_32px]">
                <div className="">
                  <div className="flex items-center justify-between">
                    <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                      {t(`Pro vision`)}
                    </p>
                    {/* 
                    <div className="flex h-6 w-fit items-center justify-center rounded bg-white px-2">
                      <p className="gdt text-sm font-semibold">Save 40%</p>
                    </div> */}
                  </div>
                  <div className="mb-6 mt-8 flex flex-col gap-3">
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        <span className="font-italic mx-1 font-extrabold">
                          3000
                        </span>{" "}
                        {t(`Credits`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`Short Video`)} (5 sec):{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          75
                        </span>{" "}
                        {t(`videos`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`Medium Video`)} (10 sec):{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          37
                        </span>{" "}
                        {t(`videos`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`Images`)}:{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          600
                        </span>{" "}
                        {t(`AI-generated images`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />{" "}
                      {t(`Text Generation unlimited`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`AI Voice`)}:{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          75
                        </span>{" "}
                        {t(`minutes`)}
                      </p>
                    </div>
                  </div>
                  <div className="mb-8 flex items-center text-white">
                    <p className="pt-2 text-[24px]">€</p>
                    <p className="text-[36px] font-bold">36.99</p>
                    <p className="ml-2 pt-2 font-light">/ {t(`month`)}</p>
                  </div>
                  <Button
                    variant={"gradient"}
                    className="w-full"
                    onClick={() => handleButtonClick("VisionPro")}
                  >
                    <p className="">{t(`Choose`)}</p>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
              <div className="">
                <p className="font-inter gdt self-stretch text-[24px] font-bold leading-normal">
                  {t(`Infinite Pandorra`)}
                </p>
                <div className="mb-6 mt-8 flex flex-col gap-3">
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      <span className="font-italic mx-1 font-extrabold">
                        8000
                      </span>{" "}
                      {t(`Credits`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`Short Video`)} (5 sec):{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        200
                      </span>{" "}
                      {t(`videos`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`Medium Video`)} (10 sec):{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        100
                      </span>{" "}
                      {t(`videos`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`Images`)}:{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        1600
                      </span>{" "}
                      {t(`AI-generated images`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Text Generation unlimited`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`AI Voice`)}:{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        200
                      </span>{" "}
                      {t(`minutes`)}
                    </p>
                  </div>
                </div>

                <div className="mb-8 flex items-center text-white">
                  <p className="pt-2 text-[24px]">€</p>
                  <p className="text-[36px] font-bold">91.99</p>
                  <p className="ml-2 pt-2 font-light">/ {t(`month`)}</p>
                </div>
                <Button
                  variant={"ghost"}
                  className="w-full bg-white hover:bg-white/80"
                  onClick={() => handleButtonClick("PandorraInfini")}
                >
                  <p className="gdt">{t(`Choose`)}</p>
                </Button>
              </div>
            </div>
          </TabPanel>
          <TabPanel
            value={"Annually"}
            className="relative flex justify-between gap-4"
          >
            <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
              <div className="">
                <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                  {t(`Creator Pack`)}
                </p>

                <div className="mb-6 mt-8 flex flex-col gap-3">
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      <span className="font-italic mx-1 font-extrabold">
                        1000
                      </span>{" "}
                      {t(`Credits`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`Short Video`)} (5 sec):{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        25
                      </span>{" "}
                      {t(`videos`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`Medium Video`)} (10 sec):{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        12
                      </span>{" "}
                      {t(`videos`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`Images`)}:{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        80
                      </span>{" "}
                      {t(`AI-generated images`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Text Generation unlimited`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`AI Voice`)}:{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        25
                      </span>{" "}
                      {t(`minutes`)}
                    </p>
                  </div>
                </div>

                <div className="mb-8 flex items-center text-white">
                  <p className="pt-2 text-[24px]">€</p>
                  <p className="text-[36px] font-bold">142.99</p>
                  <p className="ml-2 pt-2 font-light">/ {t(`year`)}</p>
                </div>
                <Button
                  variant={"ghost"}
                  className="w-full bg-white hover:bg-white/80"
                  onClick={() => handleButtonClick("CreatorPackYear")}
                >
                  <p className="gdt">{t(`Choose`)}</p>
                </Button>
              </div>
            </div>
            <div className="flex min-h-[400px] w-[350px] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#0099FF66] to-[#CC00FF77] p-[1px]">
              <div className="flex h-full w-full shrink-0 flex-col items-start gap-[32px] rounded-[24px] bg-[#39517e77] p-[25px_32px]">
                <div className="">
                  <div className="flex items-center justify-between">
                    <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                      {t(`Pro vision`)}
                    </p>

                    {/* <div className="flex h-6 w-fit items-center justify-center rounded bg-white px-2">
                      <p className="gdt text-sm font-semibold">Save 40%</p>
                    </div> */}
                  </div>
                  <div className="mb-6 mt-8 flex flex-col gap-3">
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        <span className="font-italic mx-1 font-extrabold">
                          3000
                        </span>{" "}
                        {t(`Credits`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />{" "}
                      <p>
                        {t(`Short Video`)} (5 sec):{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          75
                        </span>{" "}
                        {t(`videos`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`Medium Video`)} (10 sec):{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          37
                        </span>{" "}
                        {t(`videos`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`Images`)}:{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          600
                        </span>{" "}
                        {t(`AI-generated images`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />{" "}
                      {t(`Text Generation unlimited`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`AI Voice`)}:{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          75
                        </span>{" "}
                        {t(`minutes`)}
                      </p>
                    </div>
                  </div>
                  <div className="mb-8 flex items-center text-white">
                    <p className="pt-2 text-[24px]">€</p>
                    <p className="text-[36px] font-bold">406.99</p>
                    <p className="ml-2 pt-2 font-light">/ {t(`year`)}</p>
                  </div>
                  <Button
                    variant={"gradient"}
                    className="w-full"
                    onClick={() => handleButtonClick("VisionProYear")}
                  >
                    <p className="">{t(`Choose`)}</p>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
              <div className="">
                <p className="font-inter gdt self-stretch text-[24px] font-bold leading-normal">
                  {t(`Infinite Pandorra`)}
                </p>
                <div className="mb-6 mt-8 flex flex-col gap-3">
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      <span className="font-italic mx-1 font-extrabold">
                        8000
                      </span>{" "}
                      {t(`Credits`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`Short Video`)} (5 sec):{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        200
                      </span>{" "}
                      {t(`videos`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`Medium Video`)} (10 sec):{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        100
                      </span>{" "}
                      {t(`videos`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`Images`)}:{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        1600
                      </span>{" "}
                      {t(`AI-generated images`)}
                    </p>
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Text Generation unlimited`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" />
                    <p>
                      {t(`AI Voice`)}:{" "}
                      <span className="font-italic mx-1 font-extrabold">
                        200
                      </span>{" "}
                      {t(`minutes`)}
                    </p>
                  </div>
                </div>

                <div className="mb-8 flex items-center text-white">
                  <p className="pt-2 text-[24px]">€</p>
                  <p className="text-[36px] font-bold">1011.99</p>
                  <p className="ml-2 pt-2 font-light">/ {t(`year`)}</p>
                </div>
                <Button
                  variant={"ghost"}
                  className="w-full bg-white hover:bg-white/80"
                  onClick={() => handleButtonClick("PandorraInfiniYear")}
                >
                  <p className="gdt">{t(`Choose`)}</p>
                </Button>
              </div>
            </div>
          </TabPanel>
        </TabContainer>
      </div>
    </div>
  )
}
