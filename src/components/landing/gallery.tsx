import TwoWayParallax from "@/components/edit-ozi/two-way-parallax"

export const LandingGallery = () => {
  const images = [
    "/img/L1.webp",
    "/img/L2.webp",
    "/img/L3.webp",
    "/img/L4.webp",
    "/img/L5.webp",
    "/img/L6.webp",
    "/img/L7.webp",
    "/img/L8.webp",
    "/img/L9.webp",
    "/img/L10.webp",
    "/img/L11.webp",
    "/img/L12.webp",
    "/img/L13.webp",
    "/img/L14.webp",
    "/img/L15.webp",
    "/img/L16.webp",
    "/img/L17.webp",
  ]
  return (
    <section className="relative w-full">
      <TwoWayParallax images={images} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white dark:from-background"></div>
    </section>
  )
}
