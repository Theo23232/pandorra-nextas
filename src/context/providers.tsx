"use client"

import "../i18n"

import { ThemeProvider } from "next-themes"
import { PropsWithChildren, useEffect, useState } from "react"

import { Toaster } from "@/components/tremor/ui/toaster"

export type ProvidersProps = PropsWithChildren

export const Providers = (props: ProvidersProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return early if not mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{props.children}</>
  }
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <Toaster />
      {props.children}
    </ThemeProvider>
  )
}
