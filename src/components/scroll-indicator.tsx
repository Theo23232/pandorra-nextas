import { useEffect, useState } from 'react';

const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScroll = () => {
      // Calculate scroll progress
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    // Add scroll event listener
    window.addEventListener("scroll", updateScroll)

    // Initial calculation
    updateScroll()

    // Cleanup
    return () => window.removeEventListener("scroll", updateScroll)
  }, [])

  return (
    <div className="fixed left-0 top-0 z-50 w-full">
      <div className="h-1 w-full bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  )
}

export default ScrollIndicator
