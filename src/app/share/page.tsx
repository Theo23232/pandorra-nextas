"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { getPublicationById } from '@/actions/publication.action';

import SharePageClient from './sharePageClient';

interface Publication {
  id: string
  prompt: string
  imageUrl: string
  user: {
    username: string
  }
}

// Loader component
function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>
  )
}

// Main content component that uses useSearchParams
function SharePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const id = searchParams?.get("id")
  const reffererId = searchParams?.get("referrer")

  const [publication, setPublication] = useState<Publication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchPublication = async () => {
      if (!id) {
        router.push("/")
        return
      }

      try {
        setLoading(true)
        const data = await getPublicationById(id)

        if (!data) {
          setError(true)
          return
        }

        setPublication(data)
      } catch (error) {
        console.error("Error fetching publication:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPublication()
  }, [id, router])

  // Handle loading state
  if (loading) {
    return <LoadingSpinner />
  }

  // Handle error state
  if (error || !publication) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-2xl font-bold">Publication Not Found</h1>
        <p className="mb-6">
          The requested publication could not be found or has been removed.
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/80"
        >
          Return to Home
        </button>
      </div>
    )
  }

  // Render content if publication exists
  return (
    <SharePageClient
      publication={publication}
      reffererId={reffererId || undefined}
    />
  )
}

// Wrapper component with Suspense
export default function SharePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SharePageContent />
    </Suspense>
  )
}
