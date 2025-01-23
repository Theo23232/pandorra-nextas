import { BackgroundBeams } from '@/components/animated/aceternity/background-beams';
import { Cover } from '@/components/animated/aceternity/cover';

export function Footer() {
  return (
    <div className="relative flex h-[60vh] items-center justify-center">
      <h1 className="relative z-20 mx-auto mt-6 max-w-7xl bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 bg-clip-text py-6 text-center text-4xl font-semibold text-transparent md:text-4xl lg:text-6xl dark:from-neutral-800 dark:via-white dark:to-white">
        Generate with Pandorra AI <br /> at <Cover>warp speed</Cover>
      </h1>
      <BackgroundBeams />
    </div>
  )
}
