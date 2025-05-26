"use client"

import { Expand, Heart, Smile, Users, Zap } from "lucide-react"
import Link from "next/link"

import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { cn } from "@/lib/utils"

export type EffectMenuProps = {
  className?: string
}

const menus = [
  {
    text: "Hug",
    link: "/video?genType=hug",
    icon: Users,
    description: "Warm embrace effects",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-600",
  },
  {
    text: "Kiss",
    link: "/video?genType=kiss",
    icon: Heart,
    description: "Romantic kiss animations",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-600",
  },
  {
    text: "Heart Gesture",
    link: "/video?genType=heart_gesture",
    icon: Heart,
    description: "Love hand gestures",
    gradient: "from-red-500/20 to-pink-500/20",
    iconColor: "text-red-600",
  },
  {
    text: "Squish",
    link: "/video?genType=squish",
    icon: Smile,
    description: "Playful squish effects",
    gradient: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-600",
  },
  {
    text: "Expansion",
    link: "/video?genType=expansion",
    icon: Expand,
    description: "Dynamic expansion",
    gradient: "from-blue-500/20 to-cyan-500/20",
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

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {menus.map((menu) => {
          const IconComponent = menu.icon

          return (
            <Link key={menu.text} href={menu.link} className="group">
              <MagicCard className="relative h-20 cursor-pointer overflow-hidden border-0 p-0 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-300 group-hover:opacity-70",
                    menu.gradient,
                  )}
                />

                <div className="relative flex h-full flex-col items-center justify-center p-2 text-center">
                  <div
                    className={cn(
                      "mb-1 rounded-full bg-white/10 p-1 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110",
                    )}
                  >
                    <IconComponent className={cn("h-4 w-4", menu.iconColor)} />
                  </div>

                  <h3 className="text-xs font-medium text-foreground transition-colors duration-300">
                    {menu.text}
                  </h3>

                  <p className="mt-0.5 text-[10px] text-muted-foreground transition-opacity duration-300">
                    {menu.description}
                  </p>
                </div>

                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
              </MagicCard>
            </Link>
          )
        })}
        <MagicCard className="relative h-20 cursor-not-allowed overflow-hidden border-dashed border-muted-foreground/30 bg-muted/20 p-0 opacity-60">
          <div className="flex h-full flex-col items-center justify-center p-2 text-center">
            <div className="mb-1 rounded-full bg-muted p-1">
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="text-xs font-medium text-muted-foreground">
              More Effects
            </h3>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Coming Soon
            </p>
          </div>
        </MagicCard>
      </div>
    </div>
  )
}
