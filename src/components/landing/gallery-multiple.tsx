import Bounce from "@/components/animated/uibeats/bounce"
import { Button } from "@/components/tremor/ui/button"

export const GalleryMultiple = () => {
  return (
    <div className="mt-24 flex flex-col items-center justify-center">
      <Bounce className="font-inter text-center text-[80px] font-semibold leading-[78px] tracking-[-4.5px] text-[#FDFDFD]">
        Get inspired by <br /> other creators
      </Bounce>
      <Bounce className="flex max-w-[1278px] gap-8 pt-12">
        <button className="font-inter flex h-[16.8px] w-[100.295px] flex-shrink-0 cursor-pointer flex-col justify-center text-[14px] font-medium leading-[22px] text-white">
          Trending
        </button>
        <button className="font-inter flex h-[16.8px] w-[100.295px] flex-shrink-0 cursor-pointer flex-col justify-center text-[14px] font-medium leading-[22px] text-white/50">
          Vibrant Colors
        </button>
        <button className="font-inter flex h-[16.8px] w-[100.295px] flex-shrink-0 cursor-pointer flex-col justify-center text-[14px] font-medium leading-[22px] text-white/50">
          Adventure
        </button>
        <button className="font-inter flex h-[16.8px] w-[100.295px] flex-shrink-0 cursor-pointer flex-col justify-center text-[14px] font-medium leading-[22px] text-white/50">
          Playful
        </button>
        <button className="font-inter flex h-[16.8px] w-[100.295px] flex-shrink-0 cursor-pointer flex-col justify-center text-[14px] font-medium leading-[22px] text-white/50">
          Passion
        </button>
        <button className="font-inter flex h-[16.8px] w-[100.295px] flex-shrink-0 cursor-pointer flex-col justify-center text-[14px] font-medium leading-[22px] text-white/50">
          Humor
        </button>
        <button className="font-inter flex h-[16.8px] w-[100.295px] flex-shrink-0 cursor-pointer flex-col justify-center text-[14px] font-medium leading-[22px] text-white/50">
          Wildlife
        </button>
        <button className="font-inter flex h-[16.8px] w-[100.295px] flex-shrink-0 cursor-pointer flex-col justify-center text-[14px] font-medium leading-[22px] text-white/50">
          Futuristic
        </button>
        <button className="font-inter flex h-[16.8px] w-[100.295px] flex-shrink-0 cursor-pointer flex-col justify-center text-[14px] font-medium leading-[22px] text-white/50">
          Sunset
        </button>
      </Bounce>

      <Bounce className="relative">
        <div className="absolute -right-40 bottom-12 h-[288.328px] w-[854.914px] flex-shrink-0 rounded-[854.914px] bg-[rgba(204,0,255,0.32)] blur-[121.55000305175781px] filter"></div>
        <img
          src="/assets/trending.png"
          alt=""
          className="relative mt-16 h-auto w-full max-w-[884px]"
        />
      </Bounce>

      <Bounce className="">
        <Button className="mt-20 rounded-full bg-white text-black hover:bg-slate-100">
          View more
        </Button>
      </Bounce>
    </div>
  )
}
