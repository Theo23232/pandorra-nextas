"use client"

import { Minus, Plus } from 'lucide-react';
import * as React from 'react';

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
      answer: "Details about commission structure and earning potential.",
    },
    {
      question: "Do I need technical skills to use Pandorra.ai?",
      answer: "Information about payment schedules and processes.",
    },
  ],
  [
    {
      question: "How do I purchase more credits?",
      answer: "Details about the earnings dashboard and tracking system.",
    },
    {
      question: "Can I use AI-generated content for commercial purposes?",
      answer: "Information about referral requirements and earning conditions.",
    },
    {
      question: "What makes Pandorra.ai different from other AI platforms?",
      answer:
        "Explanation of policies regarding subscription cancellations and earnings.",
    },
  ],
]

function FAQAccordion() {
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
                    isOpen ? "bg-gradient-to-r from-[#0099FF] to-[#CC00FF]" : ""
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
                            {item.question}
                          </span>
                          <div className="mt-1 flex-shrink-0">
                            <AccordionIcon isOpen={isOpen} />
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="max-w-[450px] px-3 pb-4 text-start text-slate-300 transition-all duration-300 ease-in-out">
                        {item.answer}
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
  return (
    <Bounce className="realtive mb-40 mt-[272px] flex flex-col items-center justify-center gap-8">
      <p
        id="FAQ"
        className="text-[64px] font-semibold leading-[68px] text-white"
      >
        Curious About Pandorra.ai?
        <br />
        <span className="bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
          We’ve Got You Covered!
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
