import type { Metadata } from "next"
import { RefundPolicyContent } from "./refund-content"

export const metadata: Metadata = {
  title: "Refund Policy | Pandorra.ai",
  description:
    "Learn about our refund policy at Pandorra.ai, your AI-powered digital creation platform.",
  openGraph: {
    title: "Refund Policy | Pandorra.ai",
    description:
      "Learn about our refund policy at Pandorra.ai, your AI-powered digital creation platform.",
    url: "https://pandorra.ai/refund-policy",
    siteName: "Pandorra.ai",
    locale: "en_US",
    type: "website",
  },
}

export default function AboutPage() {
  return <RefundPolicyContent />
}
