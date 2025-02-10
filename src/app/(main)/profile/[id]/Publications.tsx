"use client"

import { useEffect, useState } from "react"
import Masonry from "react-masonry-css"
import useSWR from "swr"

import PubCard from "@/components/(main)/explore/PubCard"
import { NothingYet } from "@/components/NothingYet"
import { Skeleton } from "@/components/nyxb/skeleton"
import { fetcher } from "@/lib/utils"
import { PublicationWithAuthor } from "@/types/publicationType"

export type PublicationsProps = {
  userId: string
}

export const PublicationsProfile = (props: PublicationsProps) => {
  const {
    data: publications,
    error,
    isLoading,
  } = useSWR<PublicationWithAuthor[]>(
    `/api/publication/user?userId=${props.userId}`,
    fetcher,
    {
      refreshInterval: 10000,
    },
  )
  const [loadedPublications, setLoadedPublications] = useState<
    PublicationWithAuthor[]
  >([])

  useEffect(() => {
    if (publications) {
      setLoadedPublications(publications)
    }
  }, [publications])

  if (!loadedPublications) {
    return (
      <div className="mt-8">
        <Masonry
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
          breakpointCols={{
            default: 4,
            1440: 3,
            1200: 2,
            700: 1,
          }}
        >
          {Array.from({ length: 30 }).map((_, id) => {
            const heights = ["30vh", "40vh", "50vh", "20vh"]
            const randomHeight =
              heights[Math.floor(Math.random() * heights.length)]
            return <Skeleton key={id} className={`h-[${randomHeight}]`} />
          })}
        </Masonry>
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

  if (!isLoading && !publications)
    return (
      <NothingYet
        title="There is no publication yet"
        className="w-full"
        subtitle="When a user post a generation it will appear here"
      />
    )
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
            pubOwnerId={pub.user.id}
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
