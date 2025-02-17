'use client';

import { ActivePlanStat } from '@/app/(authenticated)/admin/(graphs)/activePlanStats';
import { NewUserStats } from '@/app/(authenticated)/admin/(graphs)/newUserStats';
import { StatsWithTrends } from '@/app/(authenticated)/admin/(graphs)/publicationStats';

export default function AccountPage() {
  return (
    <div className='space-y-2'>
      <StatsWithTrends />
      <div className='flex w-full gap-4'>
        <NewUserStats />
        <ActivePlanStat />
      </div>
    </div>
  );
}
