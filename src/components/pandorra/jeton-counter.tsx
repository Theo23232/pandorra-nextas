"use client"
import { Gem } from "lucide-react"
import Link from "next/link"

import { Tooltip } from "@/components/tremor/ui/tooltip"
import { useUser } from "@/hooks/use-user"
import { Plan } from "@prisma/client"

export default function JetonCounter() {
  const { user } = useUser()

  return (
    <div className="flex items-center justify-center gap-3">
      <Tooltip content={`You have ${user?.jeton} tokens. Click to get more`}>
        <Link
          href={"/billing"}
          prefetch
          type="button"
          id="radix-:Rmf7mfnmmn4q:"
          aria-haspopup="menu"
          aria-expanded="false"
          data-state="closed"
          className="dark:data-[state=open]:ring-neutral-0 light-v1 bg-neutral-20 focus:bg-neutral-20 dark-v1 md group flex h-fit w-full items-center justify-between rounded-xl p-0 text-left text-sm text-neutral-900 outline-none ring-0 ring-inset transition-all duration-500 hover:bg-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-neutral-200 data-[state=open]:ring-1 data-[state=open]:ring-neutral-900 dark:bg-neutral-800 dark:text-white dark:shadow-none dark:hover:bg-neutral-700 dark:hover:shadow-none dark:focus:bg-neutral-800 dark:disabled:opacity-50 dark:data-[placeholder]:text-white"
        >
          <div className="flex h-fit w-fit flex-col">
            <div className="bg-neutral-30 hover:bg-neutral-40 flex h-8 items-center gap-0.5 overflow-hidden rounded-[10px] px-3 py-2 text-sm font-semibold text-neutral-900 transition-colors duration-500 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600">
              <span>{user?.jeton}</span>
              <svg
                fill="none"
                height="24"
                width="24"
                viewBox="0 0 24 24"
                className="size-4"
              >
                <path
                  fill="currentColor"
                  d="M8.71 9.005a.734.734 0 0 0 .295-.295l2.35-4.327a.734.734 0 0 1 1.29 0l2.35 4.327c.068.125.17.227.295.295l4.327 2.35a.734.734 0 0 1 0 1.29l-4.327 2.35a.734.734 0 0 0-.295.295l-2.35 4.327a.734.734 0 0 1-1.29 0l-2.35-4.327a.734.734 0 0 0-.295-.295l-4.327-2.35a.734.734 0 0 1 0-1.29l4.327-2.35Z"
                ></path>
              </svg>
            </div>
          </div>
        </Link>
      </Tooltip>
      {user && user?.plan === Plan.Free && (
        <Tooltip content={`You are in free plan. Click to upgrade`}>
          <Link
            prefetch
            href={"/billing"}
            className="dark:disabled:text-neutral-0 disabled:bg-neutral-30 flex h-8 translate-y-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary/15 bg-opacity-[0.15] px-3.5 py-1.5 text-center text-sm font-semibold text-primary shadow-none outline-none [transition:color_500ms,background-color_500ms,border-color_500ms,text-decoration-color_500ms,fill_500ms,stroke_500ms,transform] hover:bg-opacity-[0.24] active:translate-y-[0.0625rem] active:transform disabled:cursor-default disabled:text-neutral-900 disabled:opacity-50 disabled:shadow-none disabled:active:translate-y-0 dark:bg-primary/30 dark:bg-opacity-[0.30] dark:text-primary dark:hover:bg-opacity-[0.50] dark:disabled:bg-neutral-700 dark:disabled:opacity-30"
          >
            <Gem size={20} fill="currentColor" /> Upgrade
          </Link>
        </Tooltip>
      )}
    </div>
  )
}
