import { redirect } from 'next/navigation';

import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { LandingGallery } from '@/components/landing/gallery';
import { Hero } from '@/components/landing/hero';
import LandingNavbar from '@/components/landing/navbar';
import { ScrollName } from '@/components/landing/scroll-name';
import { Testimonials } from '@/components/landing/testimonials';
import { currentUser } from '@/lib/current-user';

export default async function RoutePage() {
  const user = await currentUser()
  if (user) return redirect("/explore")
  return (
    <div>
      <LandingNavbar />
      <Hero />
      <ScrollName />
      <Features />
      <Testimonials />
      <LandingGallery />
      <Footer />
    </div>
  )
}
