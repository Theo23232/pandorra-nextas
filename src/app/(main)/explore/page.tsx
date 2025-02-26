import { Onborda, OnbordaProvider } from "onborda"

import { MenuList } from "@/components/(main)/explore/menu-list"
import { PublicationContent } from "@/components/(main)/explore/PublicationContent"
import { RotatingVideosBanner } from "@/components/(main)/explore/rotating-video-banner"
import { OnboardaCard } from "@/components/onboarda/OnboardaCard"
import { tours } from "@/lib/onboarda/steps"

export default function RoutePage() {
  return (
    <OnbordaProvider>
      <Onborda
        steps={tours}
        showOnborda={true}
        shadowRgb="55,48,163"
        shadowOpacity="0.8"
        cardComponent={OnboardaCard}
        cardTransition={{
          duration: 0.8,
          type: "spring",
          bounce: 0.25,
          damping: 10,
          mass: 0.7,
          stiffness: 75,
        }}
      >
        <div className="mt-4">
          <RotatingVideosBanner />
          <MenuList />
          <PublicationContent />
        </div>
      </Onborda>
    </OnbordaProvider>
  )
}
