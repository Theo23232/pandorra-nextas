"use client"
import { useTranslation } from 'react-i18next';

import Bounce from '@/components/animated/uibeats/bounce';

export const DescribeSection = () => {
  const { t } = useTranslation()
  return (
    <Bounce className="relative mb-8 mt-64 flex flex-col items-center justify-center gap-4 lg:mt-[600px]">
      <div className="flex w-full flex-col items-center justify-center gap-8">
        <p className="font-inter max-w-4xl text-center text-[64px] font-semibold leading-[68px] text-white max-md:text-[50px]">
          {t(`How it`)}
          <span className="mx-2 bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
            {t(`Works`)}
          </span>
        </p>
        <div
          className="mx-2 rounded-[16px] bg-gradient-to-r from-[#0099FF] to-[#CC00FF] p-[1.5px]"
          style={{
            boxShadow: "0px 4px 60px 0px rgba(188, 46, 255, 0.25)",
          }}
        >
          <div
            className="flex w-[789px] items-center justify-start gap-[66px] rounded-[16px] p-[40px] text-white max-md:w-[600px] max-sm:w-fit md:w-[789px] md:p-[40px]"
            style={{
              background: "black",
            }}
          >
            <p
              className="mx-2 bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text p-1 text-[42px] font-semibold leading-[28px] text-transparent max-sm:hidden"
              style={{
                fontStyle: "italic",
              }}
            >
              1
            </p>
            <p className="text-[24px] font-normal leading-[28px]">
              <span className="font-semibold">{t(`Sign Up`)} - </span>
              {t(`Create your affiliate account in seconds`)}
            </p>
          </div>
        </div>
        {["2", "3", "4"].map((number, index) => (
          <div
            key={index}
            className="flex items-center justify-start gap-[66px] rounded-[16px] p-[25px] text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-[#0099FF] hover:to-[#CC00FF] hover:shadow-[0px_4px_60px_0px_rgba(188,46,255,0.25)] max-md:w-[600px] max-sm:mx-2 max-sm:w-fit md:w-[789px] md:p-[40px]"
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              background: "rgba(116, 114, 138, 0.20)",
            }}
          >
            <p
              className="mx-2 bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text p-1 text-[42px] font-semibold leading-[28px] text-transparent max-sm:hidden"
              style={{
                fontStyle: "italic",
              }}
            >
              {number}
            </p>
            <p className="text-[24px] font-normal leading-[28px]">
              {number === "2" && (
                <>
                  <span className="font-semibold">
                    {t(`Share Your Link`)} -{" "}
                  </span>
                  {t(`Get your unique referral link and start sharing.`)}
                </>
              )}
              {number === "3" && (
                <>
                  {t(`Earn`)}
                  <span className="mx-2 bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
                    {t(`30% Commission`)} -{" "}
                  </span>
                  {t(
                    `Every time someone subscribes using your link, you earn 30% of their subscription.`,
                  )}
                </>
              )}
              {number === "4" && (
                <>
                  <span className="font-semibold">{t(`Get Paid`)} - </span>
                  {t(
                    `Withdraw your earnings easily via your preferred payment method.`,
                  )}
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </Bounce>
  )
}
