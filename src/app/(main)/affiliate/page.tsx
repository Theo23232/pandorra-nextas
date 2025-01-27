import { MoneyTracker } from '@/components/referrals/MoneyTracker';
import { SponsorShareLink } from '@/components/referrals/SponsorShareLink';
import { Card } from '@/components/tremor/ui/card';

export default function Page() {
  return (
    <Card className="w-fit">
      <MoneyTracker />
      <SponsorShareLink />
    </Card>
  )
}
