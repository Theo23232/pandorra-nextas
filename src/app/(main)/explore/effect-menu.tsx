"use client"

import { Flame } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export type EffectMenuProps = {
  className?: string
}

const menus = [
  {
    text: "Hug",
    link: "/video?genType=hug",
    media: "/hug.png",
    description: "Warm embrace effects",
    iconColor: "text-amber-600",
  },
  {
    text: "Kiss",
    link: "/video?genType=kiss",
    media: "/kiss.png",
    description: "Romantic kiss animations",
    iconColor: "text-pink-600",
  },
  {
    text: "Heart Gesture",
    isTrending: true,
    link: "/video?genType=heart_gesture",
    media: "/heart_gesture.png",
    description: "Love hand gestures",
    iconColor: "text-red-600",
  },
  {
    text: "Squish",
    link: "/video?genType=squish",
    media: "/squish.png",
    description: "Playful squish effects",
    iconColor: "text-purple-600",
  },
  {
    text: "Expansion",
    link: "/video?genType=expansion",
    media: "/expansion.png",
    description: "Dynamic expansion",
    iconColor: "text-blue-600",
  },
]

export const EffectMenu = ({ className }: EffectMenuProps) => {
  return (
    <div className={cn("mt-8", className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Choose an Effect</h2>
        <p className="text-muted-foreground">
          Select a video generation effect to get started
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
        {menus.map((menu) => {
          return (
            <Link
              key={menu.text}
              href={menu.link}
              className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-lg p-2 transition-shadow hover:shadow-lg"
              style={{
                backgroundImage: `url(${menu.media})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {menu.isTrending && (
                <div className="absolute right-2 top-2 z-10 flex items-center justify-center gap-1 rounded-sm bg-white px-2.5 py-0.5 font-semibold text-orange-500">
                  <Flame size={16} strokeWidth={2.75} />
                  Trending
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10" />
              <div className="relative z-10 flex flex-col">
                <h3 className="text-lg font-semibold text-white drop-shadow">
                  {menu.text}
                </h3>
                <p className="text-md text-white/80 drop-shadow">
                  {menu.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
