"use client"

import type React from "react"

import { Copy, Facebook, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

import LandingNavbar from '@/components/landing/navbar';
import { formatDate } from '@/lib/formatDate';

// Client component for share buttons
function ShareButton({
  icon,
  label,
  onClick,
  color,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  color: string
}) {
  return (
    <button
      className={`flex items-center justify-center rounded-full px-4 py-2 ${color} transition-colors`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
}

function shareOnPlatform(
  platform: "twitter" | "facebook" | "linkedin",
  publicationId: string,
) {
  const shareUrl = `https://pandorra.ai/share?id=${publicationId}`
  const text =
    "Check out this amazing AI-generated image created with Pandorra.ai!"

  let url = ""

  switch (platform) {
    case "twitter":
      url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
      break
    case "facebook":
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
      break
    case "linkedin":
      url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent("Amazing AI Creation")}&summary=${encodeURIComponent(text)}`
      break
  }

  window.open(url, "_blank")
}

function copyShareLink(publicationId: string) {
  const shareUrl = `https://pandorra.ai/share?id=${publicationId}`
  navigator.clipboard.writeText(shareUrl)

  // You would typically show a toast notification here
  alert("Link copied to clipboard!")
}

interface SharePageClientProps {
  publication: any
  reffererId: string | undefined
}

export default function SharePageClient({
  publication,
  reffererId,
}: SharePageClientProps) {
  useEffect(() => {
    if (reffererId) {
      localStorage.setItem("referrerId", reffererId)
    }
  }, [])
  return (
    <>
      <LandingNavbar />
      <div className="from-pandora-darkBlue to-pandora-darkPurple bg-gradient-to-b text-white">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="flex flex-col items-center">
            {/* Header */}
            <h1 className="mb-2 mt-20 text-center text-3xl font-bold md:text-4xl">
              Amazing AI Creation
            </h1>
            <p className="mb-8 text-center text-lg text-gray-300">
              Created with Pandorra.ai by{" "}
              {publication.user.name || "a Pandorra User"}
            </p>

            {/* Image */}
            <Image
              src={publication.imageUrl || "/placeholder.svg"}
              alt={publication.prompt}
              width={1200}
              height={800}
              className="mb-8 h-full max-h-[70vh] w-auto rounded-lg object-cover"
              priority
            />

            {/* Details */}
            <div className="mb-8 w-full rounded-xl bg-black/20 p-6">
              <h2 className="mb-2 text-xl font-semibold">Prompt</h2>
              <p className="mb-4 text-gray-300">{publication.prompt}</p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Model</h3>
                  <p>{publication.model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Preset</h3>
                  <p>{publication.preset}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Created</h3>
                  <p>{formatDate(publication.createdAt)} ago</p>
                </div>
              </div>

              {/* CTA */}
              <div className="from-pandora-purple/20 to-pandora-blue/20 mb-8 mt-8 w-full rounded-xl bg-gradient-to-r p-6">
                <h2 className="mb-4 text-center text-2xl font-bold">
                  Create your own AI images with Pandorra.ai
                </h2>
                <p className="mb-6 text-center">
                  Sign up now and get 10 free credits to start creating amazing
                  AI-generated images!
                </p>
                <div className="flex justify-center">
                  <a
                    href="https://pandorra.ai/signup?ref=share"
                    className="from-pandora-purple to-pandora-blue rounded-full bg-gradient-to-r px-8 py-3 font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Start Creating Now
                  </a>
                </div>
              </div>

              {/* Share buttons */}
              <div className="w-full">
                <h2 className="mb-4 text-center text-xl font-semibold">
                  Share this creation
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  <ShareButton
                    icon={<Twitter className="mr-2 h-5 w-5" />}
                    label="Twitter"
                    onClick={() => shareOnPlatform("twitter", publication.id)}
                    color="bg-[#1DA1F2] hover:bg-[#1a94e0]"
                  />
                  <ShareButton
                    icon={<Facebook className="mr-2 h-5 w-5" />}
                    label="Facebook"
                    onClick={() => shareOnPlatform("facebook", publication.id)}
                    color="bg-[#4267B2] hover:bg-[#3b5998]"
                  />
                  <ShareButton
                    icon={<Linkedin className="mr-2 h-5 w-5" />}
                    label="LinkedIn"
                    onClick={() => shareOnPlatform("linkedin", publication.id)}
                    color="bg-[#0077B5] hover:bg-[#006699]"
                  />
                  <ShareButton
                    icon={<Copy className="mr-2 h-5 w-5" />}
                    label="Copy Link"
                    onClick={() => copyShareLink(publication.id)}
                    color="bg-gray-700 hover:bg-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  )
}
