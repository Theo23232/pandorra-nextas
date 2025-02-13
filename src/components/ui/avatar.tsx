"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

interface ProfileAvatarProps {
  image: string
  className?: string
  profileType?: string
  isRingHidden?: boolean
  email: string
  name: string
  lastAction?: Date | null
}

const Profile = (props: ProfileAvatarProps) => {
  return (
    <div className="relative inline-block">
      <Avatar
        className={cn("size-6 object-cover ring-muted/50", props.className)}
      >
        <AvatarFallback>
          {props.name[0]}
          {props.name[1]}
        </AvatarFallback>
        <AvatarImage
          src={props.image}
          alt={`${props.email}`}
          className="object-cover"
        />
      </Avatar>
    </div>
  )
}

export { Avatar, AvatarFallback, AvatarImage, Profile }
