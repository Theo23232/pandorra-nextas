"use client"

import { Minus, Plus } from "lucide-react"
import * as React from "react"
import { useTranslation } from "react-i18next"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/affiliation/Accordion"

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
      question: "How do I sign up for the Pandorra.ai Affiliate Program?",
      answer:
        "Simply create an account, access your referral link, and start sharing!",
    },
    {
      question: "How much can I earn?",
      answer: "Details about commission structure and earning potential.",
    },
    {
      question: "When do I get paid?",
      answer: "Information about payment schedules and processes.",
    },
  ],
  [
    {
      question: "How can I track my earnings?",
      answer: "Details about the earnings dashboard and tracking system.",
    },
    {
      question: "Do referrals need to stay subscribed for me to earn?",
      answer: "Information about referral requirements and earning conditions.",
    },
    {
      question: "What happens if someone cancels their subscription?",
      answer:
        "Explanation of policies regarding subscription cancellations and earnings.",
    },
  ],
]

export default function FAQAccordion() {
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
                  className={`w-full rounded-[16px] p-[1px] hover:bg-gradient-to-r ${
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
