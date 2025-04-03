import type { Metadata } from "next"
import { notFound, redirect } from 'next/navigation';

import { getPublicationById } from '@/actions/publication.action';

import SharePageClient from './sharePageClient';

interface SharePageProps {
  searchParams: { id?: string; referrer?: string }
}

export async function generateMetadata({
  searchParams,
}: SharePageProps): Promise<Metadata> {
  const id = searchParams.id

  if (!id) {
    return {
      title: "Share AI Creation - Pandorra.ai",
      description: "Share your AI-generated images with the world",
    }
  }

  try {
    const publication = await getPublicationById(id)

    if (!publication) {
      return {
        title: "Publication Not Found - Pandorra.ai",
        description: "The requested publication could not be found",
      }
    }

    // Truncate prompt if it's too long
    const description =
      publication.prompt.length > 160
        ? `${publication.prompt.substring(0, 157)}...`
        : publication.prompt

    return {
      title: `AI Creation by ${publication.user.username || "Pandorra User"} - Pandorra.ai`,
      description,
      openGraph: {
        title: `AI Creation by ${publication.user.username || "Pandorra User"} - Pandorra.ai`,
        description,
        images: [
          {
            url: publication.imageUrl,
            width: 1200,
            height: 630,
            alt: publication.prompt,
          },
        ],
        type: "website",
        siteName: "Pandorra.ai",
      },
      twitter: {
        card: "summary_large_image",
        title: `AI Creation by ${publication.user.username || "Pandorra User"} - Pandorra.ai`,
        description,
        images: [publication.imageUrl],
        creator: "@pandorra_ai",
      },
    }
  } catch (error) {
    console.error("Error fetching publication metadata:", error)
    return {
      title: "Share AI Creation - Pandorra.ai",
      description: "Share your AI-generated images with the world",
    }
  }
}

export default async function SharePage({ searchParams }: SharePageProps) {
  const id = searchParams.id
  const reffererId = searchParams.referrer

  if (!id) {
    redirect("/")
  }

  try {
    const publication = await getPublicationById(id)

    if (!publication) {
      notFound()
    }

    return <SharePageClient publication={publication} reffererId={reffererId} />
  } catch (error) {
    console.error("Error fetching publication:", error)
    notFound()
  }
}
