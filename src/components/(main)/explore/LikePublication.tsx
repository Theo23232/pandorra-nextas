"use client"

import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { useSWRConfig } from "swr"

import {
  createPubReaction,
  deletePubReaction,
} from "@/actions/publication.action"

interface LikePubProps {
  pubIsLiked: boolean
  pubLikeCount: number
  publicationId: string
}

export const LikePublication = (props: LikePubProps) => {
  const [isLiked, setIsLiked] = useState(props.pubIsLiked)
  const [likeCount, setLikeCount] = useState<number>(props.pubLikeCount)
  const { mutate } = useSWRConfig()

  console.log(likeCount)

  const handleReaction = async () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(likeCount - 1)
      await deletePubReaction(props.publicationId)
      mutate("/api/publication/all")
    } else {
      setIsLiked(true)
      setLikeCount(likeCount + 1)
      await createPubReaction(props.publicationId)
      mutate("/api/publication/all")
    }
  }

  useEffect(() => {}, [likeCount, isLiked])

  return (
    <div
      onClick={handleReaction}
      className={`flex cursor-pointer items-center justify-center gap-1 rounded-full bg-slate-400/40 p-2 transition-all duration-300 hover:bg-slate-400/60`}
    >
      <Heart
        strokeWidth={2.25}
        className={`size-6 transition-colors ${isLiked ? "fill-primary text-primary" : "text-white"}`}
      />
    </div>
  )
}
