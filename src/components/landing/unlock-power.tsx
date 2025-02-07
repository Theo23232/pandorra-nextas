import { MoveRight } from 'lucide-react';

import Bounce from '@/components/animated/uibeats/bounce';
import { Button } from '@/components/tremor/ui/button';

export const UnlockPower = () => {
  return (
    <>
      <div className="mt-20 flex flex-col items-center justify-center">
        <Bounce className="font-inter text-center text-[64px] font-semibold leading-[68px] tracking-[-4.5px] text-[#FDFDFD]">
          Unlock the Power of AI with <br />{" "}
          <span className="bg-gradient-to-r from-[#CC00FF] to-[#0099FF] bg-clip-text px-8 text-transparent">
            Text to Video
          </span>
        </Bounce>
        <Bounce className="my-6 text-center font-medium leading-normal text-neutral-400">
          Convert simple text prompts into engaging AI-generated videos. Bring
          stories, ads, and concepts to life in <br /> seconds.
        </Bounce>
        <Bounce>
          <Button
            variant="gradient"
            className="flex items-center justify-center gap-2 rounded-full px-4"
          >
            Try for free <MoveRight />
          </Button>
        </Bounce>

        <Bounce className="relative mt-20 h-[40vw] max-h-[598px] w-full max-w-[1192px] rounded-[10px] bg-[rgba(239,239,239,0.20)] p-2 backdrop-blur-[87px]">
          <div className="absolute right-0 top-0 h-[50vw] max-h-[665px] w-[50vw] max-w-[595px] flex-shrink-0 rounded-full bg-[rgba(204,0,255,0.40)] blur-[112px]"></div>
          <div className="absolute left-0 top-0 h-[50vw] max-h-[665px] w-[50vw] max-w-[595px] flex-shrink-0 rounded-full bg-[rgba(0,155,255,0.40)] blur-[112px]"></div>
          <video
            src="https://cdn.pollo.ai/prod/public/video/index/index-text.mp4"
            className="absolute inset-0 m-auto h-[35vw] max-h-[573.387px] w-full max-w-[1166px] rounded-[3px] bg-black p-2"
            autoPlay
            loop
            muted
            playsInline
          ></video>
        </Bounce>
      </div>

      <div className="mt-20 flex flex-col items-center justify-center">
        <Bounce className="font-inter text-center text-[64px] font-semibold leading-[68px] tracking-[-4.5px] text-[#FDFDFD]">
          The Ultimate AI Content <br />
          <span className="bg-gradient-to-r from-[#CC00FF] to-[#0099FF] bg-clip-text text-transparent">
            Generation Platform
          </span>
        </Bounce>
        <Bounce className="my-6 text-center font-medium leading-normal text-neutral-400">
          🚀 Revolutionize Your Creativity with AI - Pandorra.ai empowers
          creators with cutting-edge <br /> AI models, making video, image,
          text, and voice generation seamless and powerful.
        </Bounce>
        <Bounce className="flex gap-4">
          <Button
            variant={"gradient"}
            className="mr-2 flex h-11 items-center justify-center rounded-full px-6 transition-all ease-in-out"
          >
            Create for free
          </Button>
          <Button
            variant="ghost"
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-slate-600/50 text-white hover:bg-slate-600/60"
          >
            View pricing
          </Button>
        </Bounce>

        <div className="relative flex gap-9 overflow-hidden pt-32">
          {/* first  */}
          <Bounce className="w-full max-w-[512px] rounded-lg border-1 border-[#4c4a5b] bg-[#03050c] p-0">
            <div className="relative">
              <img src="/feature-image-1.png" className="rounded-lg" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#03050c]"></div>
            </div>
            <div className="relative z-40 -mt-5 px-11 pb-10">
              <p className="font-inter text-[32px] font-bold leading-[36px] text-white">
                Why Choose <br />
                Pandorra.ai?
              </p>
              <p className="monserat mb-6 mt-4 font-thin leading-normal text-white/80">
                Whether you’re crafting stunning visuals, generating compelling
                text, or producing AI-powered videos and voices, our platform
                delivers unmatched quality, speed, and flexibility.
              </p>

              <p className="flex flex-wrap gap-3 text-[13px] font-thin leading-3 text-white">
                AI Video Generation <span className="text-[#4C4A5B]">|</span> AI
                Image Creation
                <span className="text-[#4C4A5B]">|</span> AI Text Generation{" "}
                <span className="text-[#4C4A5B]">|</span> AI Voice Synthesis
              </p>
            </div>
          </Bounce>

          {/* second */}
          <Bounce className="w-full max-w-[512px] rounded-lg border-1 border-[#4c4a5b] bg-[#03050c] p-0">
            <div className="relative">
              <img src="/feature-image-2.png" className="rounded-lg" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#03050c]"></div>
            </div>
            <div className="relative z-40 -mt-5 px-11 pb-10">
              <p className="font-inter text-[32px] font-bold leading-[36px] text-white">
                How it works?
              </p>
              <p className="monserat mb-6 mt-4 font-thin leading-normal text-white/80">
                Using Pandorra.ai is as simple as typing, selecting, and
                generating. Our intuitive platform lets you transform ideas into
                reality in just a few clicks.
              </p>

              <div className="mb-6 flex flex-wrap gap-3 text-[13px] font-thin text-white">
                ⚡ No complex tools, no limits—just pure creativity at your
                fingertips
              </div>

              <p className="flex flex-wrap gap-3 text-[13px] font-thin leading-3 text-white">
                Enter your prompt <span className="text-[#4C4A5B]">|</span>{" "}
                Choose AI model
                <span className="text-[#4C4A5B]">|</span> Generate image
                <span className="text-[#4C4A5B]">|</span> Download and share
              </p>
            </div>
          </Bounce>
          <div className="absolute -right-36 bottom-0 h-[200px] w-[500.609px] flex-shrink-0 rounded-[395.609px] bg-[rgba(0,153,255,0.50)] blur-[112px]"></div>
          <div className="absolute -left-36 bottom-0 h-[200px] w-[500.609px] flex-shrink-0 rounded-[395.609px] bg-[rgba(255,81,246,0.5)] blur-[112px]"></div>
        </div>
      </div>
    </>
  )
}
