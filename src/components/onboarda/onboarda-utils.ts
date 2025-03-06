/**
 * Utility functions for Onborda component
 */

// Function to check if Onborda is currently active
export function isOnboardaActive(): boolean {
  return !!document.querySelector(".onborda-overlay")
}

// Function to lock scrolling
export function lockScrolling(): () => void {
  const originalStyle = document.body.style.overflow
  const originalPosition = window.scrollY

  // Disable scrolling
  document.body.style.overflow = "hidden"

  // Create a handler for any scroll attempts
  const handleScroll = () => {
    window.scrollTo(0, originalPosition)
  }

  // Add event listener
  window.addEventListener("scroll", handleScroll, { passive: false })

  // Return cleanup function
  return () => {
    document.body.style.overflow = originalStyle
    window.removeEventListener("scroll", handleScroll)
  }
}

// Function to create a mutation observer that watches for Onborda activation
export function createOnboardaObserver(
  callback: (isActive: boolean) => void,
): MutationObserver {
  const observer = new MutationObserver(() => {
    const isActive = isOnboardaActive()
    callback(isActive)
  })

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  })

  return observer
}
