"use client"
interface BackgroundProps {
  imageUrl: string
}

export const BackgroundImage = (props: BackgroundProps) => {
  return (
    <div className="z-0">
      <div
        className="fixed left-0 top-0 h-screen w-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${props.imageUrl})` }}
      ></div>
      <div className="fixed h-screen w-screen bg-black/75"></div>
    </div>
  )
}
