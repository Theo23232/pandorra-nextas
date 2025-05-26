"use client"

import { Image, Video } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Masonry from "react-masonry-css"
import useSWR from "swr"
import useSWRInfinite from "swr/infinite"

import { PubVideo } from "@/components/(main)/explore/PubVideo"
import { Skeleton } from "@/components/nyxb/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetcher } from "@/lib/utils"
import {
  PublicationVideoWithAuthor,
  PublicationWithAuthor,
} from "@/types/publicationType"

import PubCard from "./PubCard"

export const PublicationContent = () => {
  const { t } = useTranslation()
  const [selectedModel, setSelectedModel] = useState("all")
  const [activeTab, setActiveTabs] = useState("image")

  const getKey = (pageIndex: number, previousPageData: any[]) => {
    if (previousPageData && !previousPageData.length) return null
    return `/api/publication/all?model=${selectedModel}&page=${pageIndex + 1}`
  }

  const {
    data,
    error,
    size,
    setSize,
    isLoading: isLoadingInitial,
  } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
  })

  const {
    data: publicationVideos,
    error: pubVideoError,
    isLoading: pubVideoIsLoading,
  } = useSWR<PublicationVideoWithAuthor[]>("/api/publication/video", fetcher)

  const publications: PublicationWithAuthor[] = data ? [].concat(...data) : []
  const isLoadingMore =
    size > 0 && data && typeof data[size - 1] === "undefined"
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 10)

  const updateURL = (value: string) => {
    const url = new URL(window.location.href)
    if (value === "all") {
      url.searchParams.delete("model")
    } else {
      url.searchParams.set("model", value)
    }
    window.history.pushState({}, "", url)
  }

  const handleTabChange = (value: string) => {
    setSelectedModel(value)
    setSize(1)
    updateURL(value)
  }

  const handleChange = (active: string) => {
    setActiveTabs(active)
  }

  const loadMore = useCallback(() => {
    if (!isReachingEnd && !isLoadingMore) {
      setSize(size + 1)
    }
  }, [isReachingEnd, isLoadingMore, setSize, size])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 1000 &&
        !isReachingEnd &&
        !isLoadingMore
      ) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMore, isReachingEnd, isLoadingMore])

  if (error) {
    return (
      <div className="w-full text-center text-red-500">
        {t(`Error loading publications`)}
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="mb-8 flex-col gap-2">
        <Tabs defaultValue="image" className="" onValueChange={handleChange}>
          <TabsList className="mb-4 w-[300px]">
            <TabsTrigger
              value="image"
              className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Image size={17} />
              {t(`Image`)}
            </TabsTrigger>
            <TabsTrigger
              value="video"
              className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Video size={19} />
              {t(`Video`)}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {activeTab === "image" && (
          <Tabs
            value={selectedModel}
            onValueChange={handleTabChange}
            className="mb-4 w-full"
          >
            <TabsList>
              <TabsTrigger
                className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                value="all"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                value="Pandorra Phoenix 1.0"
              >
                Phoenix
              </TabsTrigger>
              <TabsTrigger
                className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                value="Pandorra Anime XL"
              >
                Anime XL
              </TabsTrigger>
              <TabsTrigger
                className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                value="Pandorra Lightning XL"
              >
                Lightning
              </TabsTrigger>
              <TabsTrigger
                className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                value="SDXL 1.0"
              >
                SDXL
              </TabsTrigger>
              <TabsTrigger
                className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                value="Pandorra Kino XL"
              >
                Kino XL
              </TabsTrigger>
              <TabsTrigger
                className="hidden w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white lg:flex"
                value="Pandorra Vision XL"
              >
                Vision XL
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      {activeTab === "image" && (
        <Masonry
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
          breakpointCols={{
            default: 6,
            1440: 5,
            1200: 4,
            700: 3,
          }}
        >
          {publications.map((pub, id) => (
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
              pubOwnerId={pub.user.id}
              pubDescription={{
                prompt: pub.prompt,
                model: pub.model,
                preset: pub.preset,
              }}
              createdAt={pub.createdAt}
            />
          ))}
        </Masonry>
      )}
      {activeTab === "video" && (
        <Masonry
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
          breakpointCols={{
            default: 6,
            1440: 5,
            1200: 4,
            700: 3,
          }}
        >
          {publicationVideos?.map((pub, id) => (
            <PubVideo
              key={pub.id}
              ownerId={pub.userId}
              index={id}
              status={pub.status}
              videoPrompt={pub.prompt}
              videoDuration={pub.duration}
              videoRatio={pub.ratio}
              url={pub.videoUrl}
              commentVideoCount={pub.commentVideoCount}
              isLiked={pub.isLiked}
              likeCount={pub.reactionVideoCount}
              publicationVideoId={pub.id}
              pubOwner={pub.user.username}
              pubOwnerImage={pub.user.image}
              date={pub.createdAt}
            />
          ))}
        </Masonry>
      )}
      {isLoadingMore && (
        <div className="mt-4 flex justify-center">
          <Skeleton className="h-40 w-full max-w-md" />
        </div>
      )}
    </div>
  )
}
