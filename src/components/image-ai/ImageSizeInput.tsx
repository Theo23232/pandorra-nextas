"use client"

import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { Label } from "@/components/tremor/inputs/label"
import { Button } from "@/components/tremor/ui/button"
import { ratioList } from "@/lib/ratioList"
import { cn } from "@/lib/utils"

export type ImageSizeProps = {
  onChange: (width: number, height: number) => void
}

type RatioName = "2:3" | "16:9" | "1:1" | "4:5" | "9:16" | "2:1"
type SizeOption = "small" | "medium" | "large"

const ratioOptions: RatioName[] = ["2:3", "16:9", "1:1", "4:5", "9:16", "2:1"]
const sizeOptions: SizeOption[] = ["small", "medium", "large"]

export const ImageSizeInput = ({ onChange }: ImageSizeProps) => {
  const [activeName, setActiveName] = useState<RatioName>("2:3")
  const [activeSize, setActiveSize] = useState<SizeOption>("medium")
  const searchParams = useSearchParams()

  const findMatchingRatio = useCallback((width: number, height: number) => {
    for (const ratio of ratioList) {
      for (const size of sizeOptions) {
        // Allow for a small margin of error (e.g., 1 pixel) to account for rounding
        if (
          Math.abs(ratio[size].w - width) <= 1 &&
          Math.abs(ratio[size].h - height) <= 1
        ) {
          return { ratio: ratio.ratio as RatioName, size }
        }
      }
    }
    return null
  }, [])

  useEffect(() => {
    const imageSizeParam = searchParams?.get("imageSize")
    if (imageSizeParam) {
      const [width, height] = imageSizeParam.split("×").map(Number)
      const match = findMatchingRatio(width, height)
      if (match) {
        setActiveName(match.ratio)
        setActiveSize(match.size)
      } else {
        // If no exact match is found, find the closest ratio
        const closestRatio = ratioList.reduce((closest, current) => {
          const currentRatio = current.medium.w / current.medium.h
          const targetRatio = width / height
          return Math.abs(currentRatio - targetRatio) <
            Math.abs(closest.medium.w / closest.medium.h - targetRatio)
            ? current
            : closest
        })
        setActiveName(closestRatio.ratio as RatioName)
        // Set size based on which dimension is closest
        const closestSize = ["small", "medium", "large"].reduce(
          (closest, size) => {
            const currentDiff =
              Math.abs(closestRatio[size].w - width) +
              Math.abs(closestRatio[size].h - height)
            const closestDiff =
              Math.abs(closestRatio[closest].w - width) +
              Math.abs(closestRatio[closest].h - height)
            return currentDiff < closestDiff ? size : closest
          },
          "medium" as SizeOption,
        )
        setActiveSize(closestSize as SizeOption)
      }
    }
  }, [searchParams, findMatchingRatio])

  const handleChange = useCallback(
    (newRatio: RatioName | null, newSize: SizeOption | null) => {
      const ratio = newRatio || activeName
      const size = newSize || activeSize
      const dimensions = ratioList.find((r) => r.ratio === ratio)?.[size]

      if (dimensions) {
        onChange(dimensions.w, dimensions.h)
        if (newRatio) setActiveName(ratio as RatioName)
        if (newSize) setActiveSize(size)
      }
    },
    [activeName, activeSize, onChange],
  )

  const RatioButton = ({ ratio }: { ratio: RatioName }) => (
    <Button
      variant="outline"
      className={cn(
        "h-8 flex-1 text-black hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-900",
        activeName === ratio && "primeBg",
      )}
      onClick={() => handleChange(ratio, null)}
    >
      {ratio}
    </Button>
  )

  const SizeButton = ({ size }: { size: SizeOption }) => {
    const dimensions = ratioList.find((r) => r.ratio === activeName)?.[size]
    return (
      <Button
        variant="outline"
        className={cn(
          "flex w-full flex-col items-center justify-center text-black hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-900",
          activeSize === size && "primeBg",
        )}
        onClick={() => handleChange(null, size)}
      >
        <p className="text-sm capitalize">{size}</p>
        <p className="text-[8px]">
          {dimensions ? `${dimensions.h} × ${dimensions.w}` : "Unknown"}
        </p>
      </Button>
    )
  }

  return (
    <div className="space-y-2" id="tour5-step5">
      <Label className="mb-2">Image dimensions</Label>
      <div className="flex w-full flex-wrap gap-2">
        {[ratioOptions.slice(0, 3), ratioOptions.slice(3)].map(
          (group, index) => (
            <div key={index} className="flex w-full gap-2">
              {group.map((ratio) => (
                <RatioButton key={ratio} ratio={ratio} />
              ))}
            </div>
          ),
        )}
      </div>
      <div className="flex w-full flex-wrap justify-between gap-2">
        {sizeOptions.map((size) => (
          <SizeButton key={size} size={size} />
        ))}
      </div>
    </div>
  )
}
