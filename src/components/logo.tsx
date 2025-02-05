import Image from 'next/image';

import { cn } from '@/lib/utils';

export type logoProps = {
  className?: string
}

export const Logo = (props: logoProps) => {
  return (
    <>
      <Image
        src="/logo/logo-full-white.png"
        alt="logo"
        width={176}
        height={40}
        className={cn("hidden w-fit dark:block", props.className)}
      />
      <Image
        src="/logo/logo-full-black.png"
        alt="logo"
        width={176}
        height={40}
        className={cn("w-fit dark:hidden", props.className)}
      />
    </>
  )
}
