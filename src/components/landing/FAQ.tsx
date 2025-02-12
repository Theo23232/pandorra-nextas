"use client"

import { Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/affiliation/Accordion';
import Bounce from '@/components/animated/uibeats/bounce';

const AccordionIcon = ({ isOpen }: { isOpen: boolean }) => {
  return isOpen ? (
    <Minus className="h-5 w-5 text-[#0CF] transition-transform duration-200" />
  ) : (
    <Plus className="h-5 w-5 text-white transition-transform duration-200" />
  )
}

const faqItems = [
  [
    {
      question: "What is Pandorra.ai?",
      answer:
        "Pandorra.ai is an advanced AI-powered platform that enables users to generate high-quality content, including images, videos, text, and voice, using cutting-edge AI models.",
    },
    {
      question: "How does AI content generation work?",
      answer:
        "Your prompt is sent to our servers and processed by our AI model.",
    },
    {
      question: "Do I need technical skills to use Pandorra.ai?",
      answer:
        "No, Pandorra is designed for a broad audience, so you do not need technical skills.",
    },
  ],
  [
    {
      question: "How do I purchase more credits?",
      answer:
        "You can purchase more credits by clicking the 'Add More Credits' tab and choosing the amount you want.",
    },
    {
      question: "Can I use AI-generated content for commercial purposes?",
      answer: "Yes, you own your generated content.",
    },
    {
      question: "What makes Pandorra.ai different from other AI platforms?",
      answer:
        "We use the most advanced AI models, and you can access them all on a single platform with just one subscription.",
    },
  ],
]

function FAQAccordion() {
  const { t } = useTranslation()
  const [openItem, setOpenItem] = React.useState<string | undefined>(undefined)

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="flex flex-col gap-4 md:flex-row">
        {faqItems.map((column, colIndex) => (
          <div key={`column-${colIndex}`} className="flex-1 space-y-4">
            {column.map((item, itemIndex) => {
              const isOpen = openItem === `item-${colIndex}-${itemIndex}`
              return (
                <div
                  key={`item-${colIndex}-${itemIndex}`}
                  className={`w-full rounded-[16px] p-[1.5px] hover:bg-gradient-to-r ${
                    isOpen
                      ? "mx-2 bg-gradient-to-r from-[#0099FF] to-[#CC00FF]"
                      : ""
                  }`}
                  style={{
                    boxShadow: isOpen
                      ? "0px 4px 60px 0px rgba(188, 46, 255, 0.25)"
                      : "",
                  }}
                >
                  <Accordion
                    type="single"
                    collapsible
                    value={openItem}
                    onValueChange={(value) => setOpenItem(value)}
                  >
                    <AccordionItem
                      value={`item-${colIndex}-${itemIndex}`}
                      className="overflow-hidden rounded-2xl border-none bg-slate-900 p-[25px] transition-all duration-300 ease-in-out"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex w-full items-start justify-between">
                          <span className="pr-4 text-left text-[24px] font-medium text-white">
                            {t(item.question)}
                          </span>
                          <div className="mt-1 flex-shrink-0">
                            <AccordionIcon isOpen={isOpen} />
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="max-w-[450px] px-3 pb-4 text-start text-slate-300 transition-all duration-300 ease-in-out">
                        {t(item.answer)}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FAQ() {
  const { t } = useTranslation()

  return (
    <Bounce className="realtive mb-40 mt-[272px] flex flex-col items-center justify-center gap-8">
      <p
        id="FAQ"
        className="text-[64px] font-semibold leading-[68px] text-white"
      >
        {t(`Curious About Pandorra.ai?`)}
        <br />
        <span className="mx-2 bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
          {t(`We’ve Got You Covered!`)}
        </span>
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
