// RelatedPublications.tsx
"use client"

import Image from "next/image"
import useSWR from "swr"

import { Separator } from "@/components/ui/separator"
import { fetcher } from "@/lib/utils"
import { PublicationWithAuthor } from "@/types/publicationType"

interface RelatedPublicationsProps {
  modelName: string
  currentPublicationId: string
}

export default function RelatedPublications({
  modelName,
  currentPublicationId,
}: RelatedPublicationsProps) {
  const { data: publications } = useSWR<PublicationWithAuthor[]>(
    `/api/publication/model?modelName=${modelName}`,
    fetcher,
  )

  if (!publications?.length) return null

  const filteredPublications = publications
    .filter((pub) => pub.id !== currentPublicationId)
    .slice(0, 10)

  if (!filteredPublications.length) return null

  return (
    <div>
      <Separator orientation="horizontal" className="my-6" />
      <div className="mb-6 text-lg font-bold">Related posts</div>
      <div className="grid grid-cols-5 gap-4 pr-4">
        {filteredPublications.map((pub) => (
          <div key={pub.id} className="relative aspect-square w-full">
            <Image
              src={pub.imageUrl}
              alt={pub.prompt}
              layout="fill"
              objectFit="cover"
              className="rounded-lg bg-muted"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
