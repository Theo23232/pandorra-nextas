import { RotatingVideosBanner } from '@/components/(main)/explore/rotating-video-banner';
import GradientFlow from '@/components/background/gradient-flow';

import type { PageParams } from "@/types/next"
export default async function RoutePage(props: PageParams<{}>) {
  return (
    <div className="">
      <RotatingVideosBanner />
      <div className="mt-8 flex h-40 gap-4">
        <GradientFlow
          className="cursor-pointer"
          duration={15}
          colors={["#6366f1", "#2563eb", "#7c3aed", "#db2777"]}
          fullWidth={true}
          radialOverlay={true}
          blurAmount="0px"
        >
          <div className="mb-4 flex items-center justify-center text-lg font-semibold text-white md:text-xl">
            Image generation
          </div>
        </GradientFlow>
        <GradientFlow
          className="cursor-pointer"
          duration={10}
          colors={["#22c55e", "#059669", "#10b981", "#34d399"]}
          fullWidth={true}
          radialOverlay={true}
          blurAmount="0px"
        >
          <div className="mb-4 flex items-center justify-center text-lg font-semibold text-white md:text-xl">
            Video
          </div>
        </GradientFlow>
        <GradientFlow
          className="cursor-pointer"
          duration={20}
          colors={["#f97316", "#ea580c", "#fb923c", "#fdba74"]}
          fullWidth={true}
          radialOverlay={true}
          blurAmount="0px"
        >
          <div className="mb-4 flex items-center justify-center text-lg font-semibold text-white md:text-xl">
            AI Assistant
          </div>
        </GradientFlow>
        <GradientFlow
          className="cursor-pointer"
          duration={5}
          colors={["#3b82f6", "#2563eb", "#60a5fa", "#93c5fd"]}
          fullWidth={true}
          radialOverlay={true}
          blurAmount="0px"
        >
          <div className="mb-4 flex items-center justify-center text-lg font-semibold text-white md:text-xl">
            Voice AI
          </div>
        </GradientFlow>
      </div>
    </div>
  )
}
