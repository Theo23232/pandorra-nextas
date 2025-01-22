// Tremor Card [v0.0.2]

import React from 'react';

import { cn, cx } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild, ...props }, forwardedRef) => {
    const Component = asChild ? Slot : "div"
    return (
      <Component
        ref={forwardedRef}
        className={cx(
          // base
          "relative w-full rounded-lg border p-6 text-left shadow-sm",
          // background color
          "bg-white dark:bg-[#090E1A]",
          // border color
          "border-gray-200 dark:border-gray-900",
          className,
        )}
        tremor-id="tremor-raw"
        {...props}
      />
    )
  },
)

Card.displayName = "Card"

export type cardProps = {
  children: React.ReactNode
  className?: string
}

export const CardTitle = (props: cardProps) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold text-gray-900 dark:text-gray-50",
        props.className,
      )}
    >
      {props.children}
    </h3>
  )
}

export const CardDescription = (props: cardProps) => {
  return (
    <h3 className={cn("mb-4 text-gray-900 dark:text-gray-50", props.className)}>
      {props.children}
    </h3>
  )
}

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, type CardProps }
