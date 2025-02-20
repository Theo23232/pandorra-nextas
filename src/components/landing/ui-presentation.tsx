import Bounce from "@/components/animated/uibeats/bounce"

export const UiPresentation = () => {
  return (
    <Bounce className="relative mt-12 flex w-full items-center justify-center bg-[#010101] shadow-[2xl]">
      <img
        alt=""
        src={"/assets/UI.png"}
        className={"h-auto w-[1777px] bg-[#010101]"}
      />
      <div className="absolute left-10 top-10 h-[130px] w-[787px] shrink-0 rounded-[787px] bg-[rgba(204,0,255,0.30)] blur-[112px]"></div>
    </Bounce>
  )
}
