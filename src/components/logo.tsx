import Image from "next/image"

import { cn } from "@/lib/utils"

export type logoProps = {
  className?: string
}

export const Logo = (props: logoProps) => {
  return (
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
  )
}
