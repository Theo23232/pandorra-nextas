export const Corp = () => {
  return (
    <div className="max-w-screen relative">
      <div className="flex items-center justify-center gap-20 py-14">
        {Array.from({ length: 9 }, (_, i) => (
          <img
            key={i}
            src={`/assets/corp/${i + 1}.svg`}
            className="h-12 w-auto"
            alt={`corp ${i + 1}`}
          />
        ))}
      </div>
      <img
        src="/assets/hallo-1.svg"
        alt=""
        className="absolute -top-20 left-0 h-80 w-screen scale-[3]"
      />
    </div>
  )
}
