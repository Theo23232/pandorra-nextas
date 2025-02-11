"use client"

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Label } from '@/components/tremor/inputs/label';
import { Tooltip } from '@/components/tremor/ui/tooltip';
import { ratioList } from '@/lib/ratioList';
import { cn } from '@/lib/utils';

export type ImageSizeProps = {
  onChange: (width: number, height: number) => void
}

const ratioTooltips = [
  {
    name: "2:3",
    tooltip:
      "- Classic portrait format\n- Pinterest posts\n- Portrait-oriented images\n- Portraits and product shots.",
  },
  {
    name: "16:9",
    tooltip:
      "- Wide landscape format\n- Ideal for landscapes\n- Photography and print.",
  },
  {
    name: "1:1",
    tooltip:
      "- Square format\n- Instagram posts\n- Profile pictures and product photos.",
  },
  {
    name: "4:5",
    tooltip:
      "- Optimized portrait format\n- Instagram posts\n- Portrait shots.",
  },
  {
    name: "9:16",
    tooltip:
      "- Full-screen vertical\n- Stories and mobile display\n- Social media Stories.",
  },
  {
    name: "2:1",
    tooltip:
      "- Extended landscape\n- Banners and headers\n- Website and social media banners.",
  },
]

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
    <div
      className={cn(
        "relative inline-flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-md border px-4 text-center font-medium shadow-sm transition-all duration-100 ease-in-out",
        "h-8 w-full flex-1 border border-input text-black hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-900",
        activeName === ratio && "primeBg",
      )}
      onClick={() => handleChange(ratio, null)}
    >
      {ratio}
    </div>
  )

  const SizeButton = ({ size }: { size: SizeOption }) => {
    const dimensions = ratioList.find((r) => r.ratio === activeName)?.[size]
    return (
      <div
        className={cn(
          "relative inline-flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-md border px-4 text-center font-medium shadow-sm transition-all duration-100 ease-in-out",
          "flex w-full flex-col items-center justify-center border border-input text-black hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-900",
          activeSize === size && "primeBg",
        )}
        onClick={() => handleChange(null, size)}
      >
        <p className="text-sm capitalize">{size}</p>
        <p className="text-[8px]">
          {dimensions ? `${dimensions.h} × ${dimensions.w}` : "Unknown"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="" id="tour5-step5">
        <Label className="mb-2">Image dimensions</Label>
        <div className="grid w-full grid-cols-3 flex-wrap gap-2">
          {ratioTooltips.map((e) => (
            <Tooltip key={e.name} content={e.tooltip}>
              <RatioButton ratio={e.name as RatioName} />
            </Tooltip>
          ))}
        </div>
      </div>
      <div
        className="flex w-full flex-wrap justify-between gap-2"
        id="tour5-step6"
      >
        {sizeOptions.map((size) => (
          <SizeButton key={size} size={size} />
        ))}
      </div>
    </div>
  )
}
