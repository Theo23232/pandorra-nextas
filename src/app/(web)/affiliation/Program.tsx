"use client"
import { useTranslation } from "react-i18next"

import FAQAccordion from "@/components/affiliation/CardAccordion"
import Bounce from "@/components/animated/uibeats/bounce"

export default function Program() {
  const { t } = useTranslation()
  return (
    <Bounce className="realtive mb-40 mt-[272px] flex flex-col items-center justify-center gap-8">
      <p className="font-inter text-center text-[64px] font-semibold leading-[68px] text-white">
        {t(`Affiliate Program`)} {""}
        <span className="mx-2 bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
          FAQ
        </span>{" "}
      </p>
      <div className="relative">
        <div
          className="absolute top-20"
          style={{
            width: "523.265px",
            height: "130px",
            transform: "rotate(-27.196deg)",
            flexShrink: "0",
            borderRadius: "523.265px",
            background: "rgba(188, 46, 255, 0.60)",
            filter: "blur(157px)",
          }}
        ></div>
        <div
          className="absolute -right-5 bottom-[250px]"
          style={{
            width: "656.216px",
            height: "130px",
            transform: "rotate(-15.251deg)",
            flexShrink: "0",
            borderRadius: "656.216px",
            background: "rgba(188, 46, 255, 0.55)",
            filter: "blur(157px)",
          }}
        ></div>
        <div
          className="absolute -bottom-28 -right-40"
          style={{
            width: "395.609px",
            height: "130px",
            flexShrink: "0",
            borderRadius: "395.609px",
            background: "rgba(0, 153, 255, 0.50)",
            filter: "blur(112px)",
          }}
        ></div>
        <FAQAccordion />
      </div>
    </Bounce>
  )
}
