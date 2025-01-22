"use client"

import "../i18n"

import { ThemeProvider } from "next-themes"
import { PropsWithChildren } from "react"

import { Toaster } from "@/components/tremor/ui/toaster"

export type ProvidersProps = PropsWithChildren

export const Providers = (props: ProvidersProps) => {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <Toaster />
      {props.children}
    </ThemeProvider>
  )
}
