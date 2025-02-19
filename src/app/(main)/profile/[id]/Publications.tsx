"use client"

import { Image, Video } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Masonry from "react-masonry-css"
import useSWR from "swr"
import useSWRInfinite from "swr/infinite"

import PubCard from "@/components/(main)/explore/PubCard"
import { PubVideo } from "@/components/(main)/explore/PubVideo"
import { NothingYet } from "@/components/NothingYet"
import { Skeleton } from "@/components/nyxb/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetcher } from "@/lib/utils"
import {
  PublicationVideoWithAuthor,
  PublicationWithAuthor,
} from "@/types/publicationType"

export type PublicationsProps = {
  userId: string
}

export const PublicationsProfile = (props: PublicationsProps) => {
  const [activeTab, setActiveTabs] = useState("image")
  const { t } = useTranslation()
  const [selectedModel, setSelectedModel] = useState("all")
  const {
    data: publicationVideos,
    error: pubVideoError,
    isLoading: pubVideoIsLoading,
  } = useSWR<PublicationVideoWithAuthor[]>("/api/publication/video", fetcher)

  const getKey = (pageIndex: number, previousPageData: any[]) => {
    if (previousPageData && !previousPageData.length) return null
    return `/api/publication/all?model=${selectedModel}&page=${pageIndex + 1}`
  }

  const {
    data,
    error: err,
    size,
    setSize,
    isLoading: isLoadingInitial,
  } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
  })

  const {
    data: publications,
    error,
    isLoading,
  } = useSWR<PublicationWithAuthor[]>(
    `/api/publication/user?userId=${props.userId}`,
    fetcher,
  )
  const [loadedPublications, setLoadedPublications] = useState<
    PublicationWithAuthor[]
  >([])

  useEffect(() => {
    if (publications) {
      setLoadedPublications(publications)
    }
  }, [publications])

  const handleChange = (active: string) => {
    setActiveTabs(active)
  }

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

  if (error) {
    return (
      <div className="w-full text-center text-red-500">
        {t(`Error loading publications`)}
      </div>
    )
  }
  return (
    <div className="mt-8">
      <div className="mb-8 flex gap-2 max-lg:flex-col">
        <Tabs defaultValue="image" className="" onValueChange={handleChange}>
          <TabsList className="w-[300px]">
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
                className="flex w-full items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
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
            default: 4,
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
      )}
      {activeTab === "video" && (
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
    </div>
  )
}
