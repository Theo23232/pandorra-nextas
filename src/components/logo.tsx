"use client"
import Image from "next/image"

import { useIsSidebar } from "@/hooks/use-is-sidebar"
import { cn } from "@/lib/utils"

export type logoProps = {
  className?: string
}

export const Logo = (props: logoProps) => {
  const { isSidebar } = useIsSidebar()

  return (
    <>
      {isSidebar ? (
        <>
          <Image
            src="/logo/logo-full-white.png"
            alt="logo"
            width={1000}
            height={500}
            className={cn(
              "hidden h-[40px] w-[176px] object-contain dark:block",
              props.className,
            )}
          />
          <Image
            src="/logo/logo-full-black.png"
            alt="logo"
            width={1000}
            height={500}
            className={cn(
              "h-[40px] w-[176px] object-contain dark:hidden",
              props.className,
            )}
          />
        </>
      ) : (
        <>
          <Image
            src="/logo/logo-ai-white.png"
            alt="logo"
            width={500}
            height={500}
            className={cn(
              "hidden size-[28px] object-contain dark:block",
              props.className,
            )}
          />
          <Image
            src="/logo/logo-ai-black.png"
            alt="logo"
            width={500}
            height={500}
            className={cn(
              "size-[28px] object-contain dark:hidden",
              props.className,
            )}
          />
        </>
      )}
    </>
  )
}
