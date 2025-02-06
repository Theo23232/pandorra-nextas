import Image from "next/image"

import { cn } from "@/lib/utils"

export type logoProps = {
  className?: string
}

export const Logo = (props: logoProps) => {
  return (
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
  )
}
