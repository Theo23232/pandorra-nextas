import type { Metadata } from "next"
import { TermsAndConditionsContent } from "./terms-content"

export const metadata: Metadata = {
  title: "Terms and Conditions | Pandorra.ai",
  description:
    "Discover the terms and conditions of use for Pandorra.ai, your AI-powered digital creation platform.",
  openGraph: {
    title: "Terms and Conditions | Pandorra.ai",
    description:
      "Discover the terms and conditions of use for Pandorra.ai, your AI-powered digital creation platform.",
    url: "https://pandorra.ai/terms",
    siteName: "Pandorra.ai",
    locale: "en_US",
    type: "website",
  },
}

export default function AboutPage() {
  return <TermsAndConditionsContent />
}
