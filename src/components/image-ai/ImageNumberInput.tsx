"use client"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type ImageNumberProps = {
  onChange: (count: number) => void
}

export const ImageNumberInput = (props: ImageNumberProps) => {
  const { t } = useTranslation()
  const [count, setCount] = useState("2")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const storedCount = localStorage.getItem("count")
    const initialCount = storedCount ? JSON.parse(storedCount).toString() : "2"
    setCount(initialCount)
    setIsMounted(true)
  }, [])

  const handleChange = (count: string) => {
    setCount(count)
    localStorage.setItem("count", JSON.stringify(count))
    props.onChange(parseInt(count))
  }

  if (!isMounted) return null

  return (
    <div className="space-y-2" id="tour5-step4">
      <Label className="mb-2">{t(`Number of Images`)}</Label>
      <Tabs value={count} className="w-full" onValueChange={handleChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="1"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            1
          </TabsTrigger>
          <TabsTrigger
            value="2"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            2
          </TabsTrigger>
          <TabsTrigger
            value="3"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            3
          </TabsTrigger>
          <TabsTrigger
            value="4"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            4
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
