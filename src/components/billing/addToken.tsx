"use client"

import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { payementSession } from '@/actions/stripeSessions.action';
import Bounce from '@/components/animated/uibeats/bounce';
import { Check } from '@/components/icons/check';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/tremor/ui/dialog';
import { Button } from '@/components/ui/button';

export type addTokenProps = {
  children: ReactNode
}

export const AddTokenDialog = (props: addTokenProps) => {
  const { t } = useTranslation()
  const handleButtonClick = async (payementType: string) => {
    switch (payementType) {
      case "1000Tokens":
        await payementSession("1000 Crédits", "Achat de 1000 jetons", 1299)
        localStorage.setItem("article", "1000Tokens")
        break
      case "3000Tokens":
        await payementSession("3000 Crédits", "Achat de 3000 jetons", 3699)
        localStorage.setItem("article", "3000Tokens")
        break
      case "8000Tokens":
        await payementSession("8000 Tokens", "Achat de 8000 jetons", 9199)
        localStorage.setItem("article", "8000Tokens")
        break
      default:
        break
    }
  }
  return (
    <Dialog>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent className="relative max-h-[90vh] max-w-[1700px] overflow-x-hidden rounded-xl bg-background">
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
          <div className="relative flex min-h-[424px] w-full max-w-[1200px] items-center justify-center gap-9 pt-8">
            <div className="relative flex justify-between gap-4">
              <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
                <div className="">
                  <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                    {t(`1000 credits`)}
                  </p>

                  <div className="mb-6 mt-8 flex flex-col gap-3">
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />{" "}
                      <p>
                        {t(`Short Video`)} (5 sec):{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          8
                        </span>{" "}
                        {t(`videos`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />{" "}
                      <p>
                        {t(`Medium Video`)} (10 sec):{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          2
                        </span>{" "}
                        {t(`videos`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" /> {t(`Images`)}:{" "}
                      <p>
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
                      <Check className="mr-3" /> {t(`AI Voice`)}:{" "}
                      <p className="font-italic mx-1 font-extrabold">3</p>{" "}
                      {t(`minutes`)}
                    </div>
                  </div>

                  <div className="mb-8 flex items-center text-white">
                    <p className="pt-2 text-[24px]">€</p>
                    <p className="text-[36px] font-bold">12.99</p>
                    <p className="ml-2 pt-2 font-light"></p>
                  </div>
                  <Button
                    variant={"ghost"}
                    className="mt-auto w-full bg-white hover:bg-white/80"
                    onClick={() => handleButtonClick("1000Tokens")}
                  >
                    <p className="gdt">{t(`Add credits`)}</p>
                  </Button>
                </div>
              </div>
              <div className="flex min-h-[400px] w-[350px] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#0099FF66] to-[#CC00FF77] p-[1px]">
                <div className="flex h-full w-full shrink-0 flex-col items-start gap-[32px] rounded-[24px] bg-[#39517e77] p-[25px_32px]">
                  <div className="">
                    <div className="flex items-center justify-between">
                      <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                        {t(`3000 credits`)}
                      </p>
                    </div>
                    <div className="mb-6 mt-8 flex flex-col gap-3">
                      <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                        <Check className="mr-3" />
                        <p>
                          {t(`Short Video`)} (5 sec):{" "}
                          <span className="font-italic mx-1 font-extrabold">
                            62
                          </span>{" "}
                          {t(`videos`)}
                        </p>
                      </div>
                      <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                        <Check className="mr-3" />
                        <p>
                          {t(`Medium Video`)} (10 sec):{" "}
                          <span className="font-italic mx-1 font-extrabold">
                            32
                          </span>{" "}
                          {t(`videos`)}
                        </p>
                      </div>
                      <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                        <Check className="mr-3" />

                        <p>
                          {t(`Images`)}:{" "}
                          <span className="font-italic mx-1 font-extrabold">
                            125
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
                            125
                          </span>{" "}
                          {t(`minutes`)}
                        </p>
                      </div>
                    </div>
                    <div className="mb-8 flex items-center text-white">
                      <p className="pt-2 text-[24px]">€</p>
                      <p className="text-[36px] font-bold">34.99</p>
                      <p className="ml-2 pt-2 font-light"></p>
                    </div>
                    <Button
                      variant={"gradient"}
                      className="mt-auto w-full"
                      onClick={() => handleButtonClick("3000Tokens")}
                    >
                      <p className="">{t(`Add credits`)}</p>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
                <div className="">
                  <p className="font-inter gdt self-stretch text-[24px] font-bold leading-normal">
                    {t(`8000 credits`)}
                  </p>
                  <div className="mb-6 mt-8 flex flex-col gap-3">
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`Short Video`)} (5 sec):{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          175
                        </span>{" "}
                        {t(`videos`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {t(`Medium Video`)} (10 sec):{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          87
                        </span>{" "}
                        {t(`videos`)}
                      </p>
                    </div>
                    <div className="font-inter flex items-center text-[16px] font-normal leading-normal text-white">
                      <Check className="mr-3" />
                      <p>
                        {" "}
                        {t(`Images`)}:{" "}
                        <span className="font-italic mx-1 font-extrabold">
                          350
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
                          350
                        </span>{" "}
                        {t(`minutes`)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8 flex items-center text-white">
                    <p className="pt-2 text-[24px]">€</p>
                    <p className="text-[36px] font-bold">89.99</p>
                    <p className="ml-2 pt-2 font-light"></p>
                  </div>
                  <Button
                    variant={"ghost"}
                    className="mt-auto w-full bg-white hover:bg-white/80"
                    onClick={() => handleButtonClick("8000Tokens")}
                  >
                    <p className="gdt">{t(`Add credits`)}</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogClose>
          <Button variant={"ghost"} className="absolute right-4 top-4">
            {" "}
            <X />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
