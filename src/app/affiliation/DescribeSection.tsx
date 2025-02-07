import Bounce from '@/components/animated/uibeats/bounce';

export const DescribeSection = () => {
  return (
    <Bounce className="mb-8 mt-[600px] flex flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center justify-center gap-8">
        <p className="text-[64px] font-semibold leading-[68px] text-white">
          How it {""}
          <span className="bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
            Works
          </span>
        </p>
        <div
          className="rounded-[16px] bg-gradient-to-r from-[#0099FF] to-[#CC00FF] p-[1.5px]"
          style={{
            boxShadow: "0px 4px 60px 0px rgba(188, 46, 255, 0.25)",
          }}
        >
          <div
            className="flex w-[789px] items-center justify-start gap-[66px] rounded-[16px] p-[40px] text-white"
            style={{
              background: "black",
            }}
          >
            <p
              className="bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text p-1 text-[42px] font-semibold leading-[28px] text-transparent"
              style={{
                fontStyle: "italic",
              }}
            >
              1
            </p>
            <p className="text-[24px] font-normal leading-[28px]">
              <span className="font-semibold">Sign Up - </span>Create your
              affiliate account in seconds
            </p>
          </div>
        </div>
        {["2", "3", "4"].map((number, index) => (
          <div
            key={index}
            className="flex w-[789px] items-center justify-start gap-[66px] rounded-[16px] p-[40px] text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-[#0099FF] hover:to-[#CC00FF] hover:shadow-[0px_4px_60px_0px_rgba(188,46,255,0.25)]"
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              background: "rgba(116, 114, 138, 0.20)",
            }}
          >
            <p
              className="bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text p-1 text-[42px] font-semibold leading-[28px] text-transparent"
              style={{
                fontStyle: "italic",
              }}
            >
              {number}
            </p>
            <p className="text-[24px] font-normal leading-[28px]">
              {number === "2" && (
                <>
                  <span className="font-semibold">Share Your Link - </span>Get
                  your unique referral link and <br />
                  start sharing.
                </>
              )}
              {number === "3" && (
                <>
                  Earn{" "}
                  <span className="bg-gradient-to-r from-[#0099FF] to-[#CC00FF] bg-clip-text text-transparent">
                    30% Commission -{" "}
                  </span>
                  Every time someone <br /> subscribes using your link, you earn
                  30% of their <br />
                  subscription.
                </>
              )}
              {number === "4" && (
                <>
                  <span className="font-semibold">Get Paid - </span>
                  Withdraw your earnings easily via your <br /> preferred
                  payment method.
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </Bounce>
  )
}
