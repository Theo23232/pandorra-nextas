import { redirect } from 'next/navigation';
import { Onborda, OnbordaProvider } from 'onborda';
import { ReactNode } from 'react';

import { Sidebar } from '@/components/(main)/navigation/sidebar';
import { OnboardaCard } from '@/components/onboarda/OnboardaCard';
import { currentUser } from '@/lib/current-user';
import { tours } from '@/lib/onboarda/steps';

export default async function RouteLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await currentUser()
  if (!user) return redirect("/auth")

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
        <Sidebar />
        <main className="p-8 pt-0 lg:pl-64">{children}</main>
      </Onborda>
    </OnbordaProvider>
  )
}
