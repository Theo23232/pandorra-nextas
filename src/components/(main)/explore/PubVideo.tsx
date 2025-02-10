"use client"

import { useRef, useState } from "react"

import { LikePublicationVideo } from "@/components/(main)/explore/LikePublicationVideo"

interface PubVideoProps {
  status: string
  url: string
  videoPrompt: string
  videoDuration: number
  videoRatio: string
  index: number
  publicationVideoId: string
  likeCount: number
  commentVideoCount: number
  isLiked: boolean
  pubOwner: string
  pubOwnerImage: string
  date: Date
}

export const PubVideo = ({
  status,
  url,
  videoPrompt,
  videoDuration,
  videoRatio,
  index,
  publicationVideoId,
  likeCount,
  commentVideoCount,
  isLiked,
  pubOwner,
  pubOwnerImage,
  date,
}: PubVideoProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute left-0 right-0 top-0 z-40 flex gap-3 bg-gradient-to-b from-black/80 to-transparent p-5 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "z-40 opacity-0"
        }`}
      >
        <div className="absolute right-2 top-2">
          <LikePublicationVideo
            pubIsLiked={isLiked}
            pubLikeCount={likeCount}
            publicationId={publicationVideoId}
          />
        </div>
      </div>
      {status === "Generated" && (
        <video
          ref={videoRef}
          src={url}
          className={`h-auto w-full transform transition-transform duration-1000 ease-in-out ${isHovered ? "scale-125" : ""}`}
          loop
          muted
          playsInline
          controls={false}
        />
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-md font-semibold text-white">{pubOwner}</p>
        <p className="truncate-2-lines line-clamp-2 text-xs text-white/80">
          {videoPrompt}
        </p>
      </div>
    </div>
  )
}
