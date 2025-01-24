"use client"

import { useEffect, useState } from "react"
import Masonry from "react-masonry-css"
import useSWR from "swr"

import { fetcher } from "@/lib/utils"
import { PublicationWithAuthor } from "@/types/publicationType"

import PubCard from "./PubCard"

export const PublicationContent = () => {
  const {
    data: publications,
    error,
    isLoading,
  } = useSWR<PublicationWithAuthor[]>("/api/publication/all", fetcher, {
    refreshInterval: 10000,
  })
  const [loadedPublications, setLoadedPublications] = useState<
    PublicationWithAuthor[]
  >([])

  useEffect(() => {
    if (publications) {
      setLoadedPublications(publications)
    }
  }, [publications])

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full text-center text-red-500">
        Error loading publications
      </div>
    )
  }

  return (
    <div className="mt-8">
      <Masonry
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
        breakpointCols={{
          default: 5,
          1440: 3,
          1200: 2,
          700: 1,
        }}
      >
        {loadedPublications.map((pub, id) => (
          <PubCard
            key={pub.id}
            imageUrl={pub.imageUrl}
            index={id}
            publicationId={pub.id}
            pubOwner={pub.user.username}
            pubOwnerImage={pub.user.image ?? ""}
            isLiked={pub.isLiked}
            likeCount={pub.reactionsCount}
            commentCount={pub.commentCount}
            pubDescription={{
              prompt: pub.prompt,
              model: pub.model,
              preset: pub.preset,
            }}
            createdAt={pub.createdAt}
          />
        ))}
      </Masonry>
    </div>
  )
}
