import Bounce from "@/components/animated/uibeats/bounce"
import Marquee from "@/components/nyxb/marquee"

export const Corp = () => {
  return (
    <Bounce className="relative flex size-full flex-col items-center justify-center overflow-hidden rounded-lg border py-20 md:shadow-xl">
      <Marquee
        pauseOnHover
        className="flex items-center gap-10 [--duration:30s]"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <img
            key={i}
            src={`/assets/corp/${i + 1}.svg`}
            className="ml-40 h-12 w-auto"
            alt={`corp ${i + 1}`}
          />
        ))}
      </Marquee>
    </Bounce>
  )
}
