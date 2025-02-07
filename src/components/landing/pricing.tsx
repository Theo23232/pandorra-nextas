import { Tab, TabContainer, TabPanel, Tabs } from '@/components/animated/animated-tabs';
import Bounce from '@/components/animated/uibeats/bounce';
import { Check } from '@/components/icons/check';

export const Pricing = () => {
  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <Bounce className="font-inter text-center text-[64px] font-semibold leading-[68px] tracking-[-4.5px] text-[#FDFDFD]">
        Unlock the Full Power of <br />
        <span className="bg-gradient-to-r from-[#CC00FF] to-[#0099FF] bg-clip-text text-transparent">
          Pandorra.ai
        </span>
      </Bounce>
      <Bounce className="my-6 max-w-[800px] text-center font-medium leading-normal text-neutral-400">
        Choose the plan that fits your creative needs and experience AI-powered
        content generation like never before. Whether you're just exploring or
        need professional-grade tools, we have the right plan for you
      </Bounce>
      <div className="relative flex min-h-[424px] w-full max-w-[1200px] items-center justify-center gap-9 pt-8">
        <TabContainer className="relative flex flex-col items-center justify-center">
          <div className="absolute right-0 top-0 h-[577.161px] w-[1756.387px] flex-shrink-0 rounded-[1756.387px] bg-[rgba(204,0,255,0.4)] blur-[112px]"></div>
          <div className="absolute left-0 top-0 h-[577.161px] w-[1756.387px] flex-shrink-0 rounded-[1756.387px] bg-[rgba(0,153,255,0.4)] blur-[112px]"></div>
          <Tabs className="mb-32">
            <Tab value={"monthly"}>Monthly</Tab>
            <Tab value={"annualy"} className="flex gap-2">
              Annualy <img src="/save-27.png" className="h-6" />
            </Tab>
          </Tabs>
          <TabPanel
            value={"monthly"}
            className="relative flex justify-between gap-4"
          >
            <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
              <div className="">
                <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                  Creator Pack
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <div className="font-inter flex items-center gap-3 text-[16px] font-normal leading-normal text-white">
                    <Check /> 1000 credits
                  </div>
                  <div className="font-inter flex items-center gap-3 text-[16px] font-normal leading-normal text-white">
                    <Check /> Short Video (5 sec): 25 videos
                  </div>
                  <div className="font-inter flex items-center gap-3 text-[16px] font-normal leading-normal text-white">
                    <Check /> Medium Video (10 sec): 12 videos
                  </div>
                  <div className="font-inter flex items-center gap-3 text-[16px] font-normal leading-normal text-white">
                    <Check /> Images: 50 AI-generated images
                  </div>
                  <div className="font-inter flex items-center gap-3 text-[16px] font-normal leading-normal text-white">
                    <Check /> Text Generation: 200 text generations
                  </div>
                  <div className="font-inter flex items-center gap-3 text-[16px] font-normal leading-normal text-white">
                    <Check /> AI Voice: 50 minutes
                  </div>
                </div>
              </div>
            </div>
            <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(0,153,255,0.40)] p-[25px_32px]">
              <div className="">
                <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                  Pro vision
                </p>
              </div>
            </div>
            <div className="flex min-h-[400px] w-[350px] shrink-0 flex-col items-start gap-[32px] rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[rgba(5,10,24,0.40)] p-[25px_32px]">
              <div className="">
                <p className="font-inter self-stretch text-[24px] font-bold leading-normal text-white">
                  Pro vision
                </p>
              </div>
            </div>
          </TabPanel>
          <TabPanel
            value={"annualy"}
            className="relative flex justify-between gap-4"
          ></TabPanel>
        </TabContainer>
      </div>
    </div>
  )
}
