"use client"
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { Tooltip } from '@/components/tremor/ui/tooltip';
import { useUser } from '@/hooks/use-user';
import { Plan } from '@prisma/client';

export default function JetonCounter() {
  const { t } = useTranslation()
  const { user } = useUser()

  return (
    <div className="flex items-center justify-center gap-3">
      <Tooltip
        content={`${t("You have")} ${user?.jeton} ${t(`tokens. Click to get more`)}`}
      >
        <Link
          href={"/pricing"}
          prefetch
          type="button"
          id="radix-:Rmf7mfnmmn4q:"
          aria-haspopup="menu"
          aria-expanded="false"
          data-state="closed"
        >
          <div
            id="tour3-step1"
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-accent px-4 font-bold hover:bg-muted"
          >
            <span>{user?.jeton}</span>
            <img src="/assets/token.png" className="h-6 w-auto" />
          </div>
        </Link>
      </Tooltip>
      {user && user?.plan === Plan.Free && (
        <Tooltip content={`You are in free plan. Click to upgrade`}>
          <Link prefetch={true} href={"/pricing"}>
            <img src="/assets/upgrade.png" className="h-10 w-auto" />
          </Link>
        </Tooltip>
      )}
    </div>
  )
}
