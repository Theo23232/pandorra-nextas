"use client"

import Image from "next/image"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/formatDate"

import { LikePublication } from "./LikePublication"
import PubComment from "./PubComment"

interface PubCardProps {
  imageUrl: string
  index: number
  publicationId: string
  likeCount: number
  commentCount: number
  isLiked: boolean
  pubOwner: string
  pubOwnerImage: string
  pubDescription: {
    prompt: string
    model: string
    preset: string
  }
  createdAt: Date
}

export default function PubCard(props: PubCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative mb-4 flex h-fit flex-col overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <PubComment
        pubOwner={props.pubOwner}
        pubOwnerImage={props.pubOwnerImage}
        pubId={props.publicationId}
        pubLikeCount={props.likeCount}
        pubIsLike={props.isLiked}
        pubDescription={props.pubDescription}
        image={props.imageUrl}
        date={props.createdAt}
      >
        <Image
          width={400}
          height={700}
          className="w-full transform object-contain transition-transform duration-500 hover:scale-105 hover:cursor-pointer"
          src={props.imageUrl}
          alt={`Random stock image ${props.index + 1}`}
        />
      </PubComment>

      <div
        className={`absolute bottom-0 left-0 right-0 p-2 transition-opacity duration-100 ${isHovered ? "opacity-100" : "opacity-0"}`}
      >
        <Card>
          <CardContent className="p-2">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center justify-between gap-3">
                <Avatar className="size-8 ring-2">
                  <AvatarImage
                    src={props.pubOwnerImage ?? undefined}
                    alt="Avatar"
                  />
                  <AvatarFallback className="bg-transparent">U</AvatarFallback>
                </Avatar>
                <div className="">
                  <p className="text-md font-semibold">{props.pubOwner}</p>
                  <p className="text-xs">{formatDate(props.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LikePublication
                  pubIsLiked={props.isLiked}
                  pubLikeCount={props.likeCount}
                  publicationId={props.publicationId}
                />
              </div>
            </div>
            <p className="truncate-2-lines mt-2 line-clamp-2 text-xs">
              {props.pubDescription.prompt}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
