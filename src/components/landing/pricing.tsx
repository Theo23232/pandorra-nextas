"use client"
import { useTranslation } from 'react-i18next';

import { Tab, TabContainer, TabPanel, Tabs } from '@/components/animated/animated-tabs';
import Bounce from '@/components/animated/uibeats/bounce';
import { Check } from '@/components/icons/check';
import { Button } from '@/components/ui/button';

export const Pricing = () => {
  const { t } = useTranslation()

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
      <Bounce className="my-6 max-w-[800px] text-center font-medium leading-normal text-neutral-400">
        {t(
          `Choose the plan that fits your creative needs and experience AI-powered content generation like never before. Whether you're just exploring or need professional-grade tools, we have the right plan for you`,
        )}
      </Bounce>
      <div className="relative flex min-h-[424px] w-full max-w-[1200px] items-center justify-center gap-9 pb-48 pt-8">
        <TabContainer className="relative flex flex-col items-center justify-center">
          <Tabs className="mb-32 text-white">
            <Tab value={"small"}>{t(`Small`)}</Tab>
            <Tab value={"monthly"}>{t(`Monthly`)}</Tab>
            <Tab value={"annualy"} className="flex gap-2">
              {t(`Annualy`)} <img src="/save-27.png" className="h-6" />
            </Tab>
          </Tabs>
          <TabPanel
            value={"small"}
            className="relative flex justify-between gap-4"
          >
            <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
              <div className="">
                <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                  {t(`Free`)}
                </p>

                <div className="mb-6 mt-8 flex flex-col gap-3">
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Images`)}:{" "}
                    <p className="gdt mx-1 font-extrabold">125</p>{" "}
                    {t(`AI-generated images`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Text Generation unlimited`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                    <p className="gdt mx-1 font-extrabold">125</p>{" "}
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
            <div className="flex min-h-[400px] w-[350px] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#0099FF66] to-[#CC00FF77] p-[1px]">
              <div className="flex h-full w-full shrink-0 flex-col items-start gap-[32px] rounded-[24px] bg-[#39517e77] p-[25px_32px]">
                <div className="">
                  <div className="flex items-center justify-between">
                    <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                      {t(`Weekly`)}
                    </p>
                  </div>
                  <div className="mb-6 mt-8 flex flex-col gap-3">
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`Short Video`)} (5 sec):{" "}
                      <p className="gdt mx-1 font-extrabold">62</p>{" "}
                      {t(`videos`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`Medium Video`)} (10 sec):{" "}
                      <p className="gdt mx-1 font-extrabold">32</p>{" "}
                      {t(`videos`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`Images`)}:{" "}
                      <p className="gdt mx-1 font-extrabold">125</p>{" "}
                      {t(`AI-generated images`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />{" "}
                      {t(`Text Generation unlimited`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                      <p className="gdt mx-1 font-extrabold">125</p>{" "}
                      {t(`minutes`)}
                    </div>
                  </div>
                  <div className="mb-8 flex items-center text-white">
                    <p className="pt-2 text-[24px]">€</p>
                    <p className="text-[36px] font-bold">34.99</p>
                    <p className="ml-2 pt-2 font-light">/ {t(`month`)}</p>
                  </div>
                  <Button variant={"gradient"} className="w-full">
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
                    <Check className="mr-3" /> {t(`Short Video`)} (5 sec):{" "}
                    <p className="gdt mx-1 font-extrabold">62</p> {t(`videos`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Medium Video`)} (10 sec):{" "}
                    <p className="gdt mx-1 font-extrabold">32</p> {t(`videos`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Images`)}:{" "}
                    <p className="gdt mx-1 font-extrabold">125</p>{" "}
                    {t(`AI-generated images`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Text Generation unlimited`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                    <p className="gdt mx-1 font-extrabold">125</p>{" "}
                    {t(`minutes`)}
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

                    <div className="flex h-6 w-fit items-center justify-center rounded bg-white px-2">
                      {/* <p className="gdt text-sm font-semibold">Save 40%</p> */}
                    </div>
                  </div>
                  <div className="mb-6 mt-8 flex flex-col gap-3">
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`Short Video`)} (5 sec):{" "}
                      <p className="gdt mx-1 font-extrabold">62</p>{" "}
                      {t(`videos`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`Medium Video`)} (10 sec):{" "}
                      <p className="gdt mx-1 font-extrabold">32</p>{" "}
                      {t(`videos`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`Images`)}:{" "}
                      <p className="gdt mx-1 font-extrabold">125</p>{" "}
                      {t(`AI-generated images`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />{" "}
                      {t(`Text Generation unlimited`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                      <p className="gdt mx-1 font-extrabold">125</p>{" "}
                      {t(`minutes`)}
                    </div>
                  </div>
                  <div className="mb-8 flex items-center text-white">
                    <p className="pt-2 text-[24px]">€</p>
                    <p className="text-[36px] font-bold">34.99</p>
                    <p className="ml-2 pt-2 font-light">/ {t(`month`)}</p>
                  </div>
                  <Button variant={"gradient"} className="w-full">
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
                    <Check className="mr-3" /> {t(`Short Video`)} (5 sec):{" "}
                    <p className="gdt mx-1 font-extrabold">62</p> {t(`videos`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Medium Video`)} (10 sec):{" "}
                    <p className="gdt mx-1 font-extrabold">32</p> {t(`videos`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Images`)}:{" "}
                    <p className="gdt mx-1 font-extrabold">125</p>{" "}
                    {t(`AI-generated images`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Text Generation unlimited`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                    <p className="gdt mx-1 font-extrabold">125</p>{" "}
                    {t(`minutes`)}
                  </div>
                </div>

                <div className="mb-8 flex items-center text-white">
                  <p className="pt-2 text-[24px]">€</p>
                  <p className="text-[36px] font-bold">89.99</p>
                  <p className="ml-2 pt-2 font-light">/ {t(`month`)}</p>
                </div>
                <Button
                  variant={"ghost"}
                  className="w-full bg-white hover:bg-white/80"
                >
                  <p className="gdt">{t(`Choose`)}</p>
                </Button>
              </div>
            </div>
          </TabPanel>
          <TabPanel
            value={"annualy"}
            className="relative flex justify-between gap-4"
          >
            <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
              <div className="">
                <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                  {t(`Creator Pack`)}
                </p>

                <div className="mb-6 mt-8 flex flex-col gap-3">
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Short Video`)} (5 sec):{" "}
                    <p className="gdt mx-1 font-extrabold">62</p> {t(`videos`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Medium Video`)} (10 sec):{" "}
                    <p className="gdt mx-1 font-extrabold">32</p> {t(`videos`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Images`)}:{" "}
                    <p className="gdt mx-1 font-extrabold">125</p>{" "}
                    {t(`AI-generated images`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Text Generation unlimited`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                    <p className="gdt mx-1 font-extrabold">125</p>{" "}
                    {t(`minutes`)}
                  </div>
                </div>

                <div className="mb-8 flex items-center text-white">
                  <p className="pt-2 text-[24px]">€</p>
                  <p className="text-[36px] font-bold">113.99</p>
                  <p className="ml-2 pt-2 font-light">/ {t(`month`)}</p>
                </div>
                <Button
                  variant={"ghost"}
                  className="w-full bg-white hover:bg-white/80"
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

                    <div className="flex h-6 w-fit items-center justify-center rounded bg-white px-2">
                      {/* <p className="gdt text-sm font-semibold">Save 40%</p> */}
                    </div>
                  </div>
                  <div className="mb-6 mt-8 flex flex-col gap-3">
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`Short Video`)} (5 sec):{" "}
                      <p className="gdt mx-1 font-extrabold">62</p>{" "}
                      {t(`videos`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`Medium Video`)} (10 sec):{" "}
                      <p className="gdt mx-1 font-extrabold">32</p>{" "}
                      {t(`videos`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`Images`)}:{" "}
                      <p className="gdt mx-1 font-extrabold">125</p>{" "}
                      {t(`AI-generated images`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />{" "}
                      {t(`Text Generation unlimited`)}
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                      <p className="gdt mx-1 font-extrabold">125</p>{" "}
                      {t(`minutes`)}
                    </div>
                  </div>
                  <div className="mb-8 flex items-center text-white">
                    <p className="pt-2 text-[24px]">€</p>
                    <p className="text-[36px] font-bold">288.99</p>
                    <p className="ml-2 pt-2 font-light">/ {t(`month`)}</p>
                  </div>
                  <Button variant={"gradient"} className="w-full">
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
                    <Check className="mr-3" /> {t(`Short Video`)} (5 sec):{" "}
                    <p className="gdt mx-1 font-extrabold">62</p> {t(`videos`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Medium Video`)} (10 sec):{" "}
                    <p className="gdt mx-1 font-extrabold">32</p> {t(`videos`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Images`)}:{" "}
                    <p className="gdt mx-1 font-extrabold">125</p>{" "}
                    {t(`AI-generated images`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`Text Generation unlimited`)}
                  </div>
                  <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                    <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                    <p className="gdt mx-1 font-extrabold">125</p>{" "}
                    {t(`minutes`)}
                  </div>
                </div>

                <div className="mb-8 flex items-center text-white">
                  <p className="pt-2 text-[24px]">€</p>
                  <p className="text-[36px] font-bold">788.99</p>
                  <p className="ml-2 pt-2 font-light">/ {t(`month`)}</p>
                </div>
                <Button
                  variant={"ghost"}
                  className="w-full bg-white hover:bg-white/80"
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
