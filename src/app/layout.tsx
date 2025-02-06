import type { Metadata } from "next"
import "./globals.css"
import "./outsideStyles.css"

import NextTopLoader from "nextjs-toploader"

import { Providers } from "@/context/providers"

export const metadata: Metadata = {
  title: "Pandorra ai",
  description: "Unlock the Power of Creativity",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`min-h-screen overflow-y-scroll scroll-auto antialiased selection:bg-indigo-100 selection:text-primary dark:bg-background`}
      >
        <NextTopLoader showSpinner={false} color="#1d4ed8" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
