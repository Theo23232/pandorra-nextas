export const DescribeSection = () => {
  return (
    <div className="mb-8 mt-[600px] flex flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center justify-center gap-8">
        <p className="text-[64px] font-semibold leading-[68px] text-white">
          How it Works
        </p>
        <div
          className="flex w-[789px] items-center justify-start gap-[66px] rounded-[16px] p-[40px] text-white"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.10)",
            background: "rgba(116, 114, 138, 0.20)",
            boxShadow: "0px 4px 20.8px 0px rgba(188, 46, 255, 0.25)",
          }}
        >
          <p
            className="text-[42px] font-semibold leading-[28px]"
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
        <div
          className="flex w-[789px] items-center justify-start gap-[66px] rounded-[16px] p-[40px] text-white"
          style={{
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            background: "rgba(116, 114, 138, 0.20)",
          }}
        >
          <p
            className="text-[42px] font-semibold leading-[28px]"
            style={{
              fontStyle: "italic",
            }}
          >
            2
          </p>
          <p className="text-[24px] font-normal leading-[28px]">
            <span className="font-semibold">Share Your Link - </span>Get your
            unique referral link and <br />
            start sharing.
          </p>
        </div>
        <div
          className="flex w-[789px] items-center justify-start gap-[66px] rounded-[16px] p-[40px] text-white"
          style={{
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            background: "rgba(116, 114, 138, 0.20)",
          }}
        >
          <p
            className="text-[42px] font-semibold leading-[28px]"
            style={{
              fontStyle: "italic",
            }}
          >
            3
          </p>
          <p className="text-[24px] font-normal leading-[28px]">
            <span className="font-semibold">Earn 30% Commission - </span>Every
            time someone <br /> subscribes using your link, you earn 30% of
            their <br />
            subscription.
          </p>
        </div>
        <div
          className="flex w-[789px] items-center justify-start gap-[66px] rounded-[16px] p-[40px] text-white"
          style={{
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            background: "rgba(116, 114, 138, 0.20)",
          }}
        >
          <p
            className="text-[42px] font-semibold leading-[28px]"
            style={{
              fontStyle: "italic",
            }}
          >
            4
          </p>
          <p className="text-[24px] font-normal leading-[28px]">
            <span className="font-semibold">Get Paid - </span>
            Withdraw your earnings easily via your <br /> preferred payment
            method.
          </p>
        </div>
      </div>
    </div>
  )
}
