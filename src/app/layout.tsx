import type { Metadata } from "next"
import './globals.css';

import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { Providers } from '@/context/providers';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Pandorra AI",
  description: "Ship your SaaS faster",
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
        className={`${inter.className} overflow-y-scroll scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-background`}
      >
        <NextTopLoader showSpinner={false} color="#1d4ed8" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
