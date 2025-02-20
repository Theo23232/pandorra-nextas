import Bounce from "@/components/animated/uibeats/bounce"
import Marquee from "@/components/nyxb/marquee"

export const Corp = () => {
  return (
    <Bounce className="justify-centerrounded-lg relative flex size-full flex-col items-center border py-20 md:shadow-xl">
      <div className="absolute -bottom-12 left-0 h-[290.929px] w-[765.326px] flex-shrink-0 rounded-[765.326px] bg-[rgba(49,107,255,0.33)] blur-[121.55000305175781px]"></div>
      <div className="absolute -right-10 bottom-0 h-[130px] w-[901px] shrink-0 rounded-[901px] bg-[rgba(186,156,255,0.30)] blur-[112px]"></div>

      <Marquee
        pauseOnHover
        className="flex items-center gap-10 [--duration:30s]"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <img
            key={i}
            src={`/assets/corp/${i + 1}.svg`}
            className="ml-40 h-12 w-auto max-sm:ml-20"
            alt={`corp ${i + 1}`}
          />
        ))}
      </Marquee>
    </Bounce>
  )
}
