import type { Metadata } from "next"
import { AboutContent } from "./about-content"

export const metadata: Metadata = {
  title: "About Pandorra | Innovative Digital Creation",
  description:
    "Discover Pandorra, the company founded by Théo Lacour and Carine Léal that pushes the boundaries of digital creation with AI tools for image, video, text, and audio.",
  keywords:
    "Pandorra, digital creation, AI, artificial intelligence, Théo Lacour, Carine Léal, Guadeloupe, Saint-Barthélemy",
  authors: [{ name: "Pandorra" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pandorra.ai/about",
    title: "About Pandorra | Innovative Digital Creation",
    description:
      "Discover Pandorra, the company that pushes the boundaries of digital creation with AI tools.",
    siteName: "Pandorra.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Pandorra | Innovative Digital Creation",
    description:
      "Discover Pandorra, the company that pushes the boundaries of digital creation with AI tools.",
  },
  alternates: {
    canonical: "https://pandorra.ai/about",
  },
}

export default function AboutPage() {
  return <AboutContent />
}
