import type { Metadata } from "next"
import { PrivacyPolicyContent } from "./privacy-content"

export const metadata: Metadata = {
  title: "Privacy Policy | Pandorra.ai",
  description:
    "Learn how Pandorra.ai protects your personal data and respects your privacy.",
  openGraph: {
    title: "Privacy Policy | Pandorra.ai",
    description:
      "Learn how Pandorra.ai protects your personal data and respects your privacy.",
    url: "https://pandorra.ai/privacy-policy",
    siteName: "Pandorra.ai",
    locale: "en_US",
    type: "website",
  },
}

export default function AboutPage() {
  return <PrivacyPolicyContent />
}
