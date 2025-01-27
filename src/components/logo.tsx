"use client"

import { useTheme } from 'next-themes';
import Image from 'next/image';

import { cn } from '@/lib/utils';

export type logoProps = {
  className?: string
}

export const Logo = (props: logoProps) => {
  const { theme } = useTheme()
  return (
    <div>
      {theme == "dark" ? (
        <div className="flex items-center gap-2">
          <Image
            src="/logo/Logomark_Fond_Blanc_HD.png"
            alt="logo"
            width={32}
            height={32}
            className={cn(
              "z-40 h-full overflow-hidden rounded-md",
              props.className,
            )}
          />
          <p className="self-stretch pt-2 align-baseline text-2xl font-semibold">
            andorra.ai
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-0">
          <Image
            src="/logo/Logomark_Transparent_HD.png"
            alt="logo"
            width={32}
            height={32}
            className={cn("h-full", props.className)}
          />
          <p className="-ml-1 self-stretch pt-2 align-baseline text-2xl font-semibold">
            andorra.ai
          </p>
        </div>
      )}
    </div>
  )
}
