import Image from 'next/image';

import Bounce from '@/components/animated/uibeats/bounce';
import { Button } from '@/components/ui/button';

export default function BeforeFooter() {
  return (
    <Bounce className="relative mt-[280px]">
      <div className="absolute -top-5 w-screen">
        <Image
          src="/assets/affiliation/Mask.png"
          width={1512}
          height={400}
          alt={""}
          className="w-full"
        ></Image>
      </div>
      <div className="abolsute -left-40 top-0">
        <Image
          src="/assets/affiliation/bluehue.png"
          width={800}
          height={200}
          alt={""}
          className="w-full"
        ></Image>
        <Bounce className="absolute inset-0 -top-52 flex flex-col items-center justify-center gap-[22px]">
          <p className="text-[64px] font-semibold text-white">
            Ready to{" "}
            {/* <span className="bg-gradient-to-r from-[#2f00ff] to-[#ff00dd] bg-clip-text text-transparent"> */}
            Start Earning
            {/* </span> */}?
          </p>
          <p className="text-center text-[16px] text-white">
            Join thousands of affiliates who are already making money with
            Pandorra.ai. <br /> Start promoting today and turn your audience
            into a revenue stream!
          </p>
          <p className="text-center text-[16px] text-white">
            🔗{" "}
            <span className="bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
              Sign up now {""}
            </span>
            and get your referral link instantly!
          </p>
          <Button
            className="mt-[10px] px-[60px] py-[14px] text-black"
            style={{
              borderRadius: "37px",
              background:
                "linear-gradient(0deg, #EFEFEF 0%, #EFEFEF 100%), #8645FF",
            }}
          >
            Join the affiliate program
          </Button>
        </Bounce>
      </div>
    </Bounce>
  )
}
