"use client"

import { useEffect, useState } from "react"

import { pollRequestStatus } from "@/actions/kling.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import type { VideoGeneration } from "@prisma/client"
interface VideoGenerationsListProps {
  initialGenerations: VideoGeneration[]
}

export function VideoGenerationsList({
  initialGenerations,
}: VideoGenerationsListProps) {
  const [generations, setGenerations] =
    useState<VideoGeneration[]>(initialGenerations)

  useEffect(() => {
    // Poll for updates on processing generations
    const processingGenerations = generations.filter(
      (gen) => gen.status === "processing" && gen.requestId,
    )

    if (processingGenerations.length === 0) return

    const intervalIds: NodeJS.Timeout[] = []

    processingGenerations.forEach((generation) => {
      if (!generation.requestId) return

      const intervalId = setInterval(async () => {
        try {
          const result = await pollRequestStatus(
            generation.requestId!,
            generation.id,
          )

          if (result.status === "completed" && result.output?.video?.url) {
            // Update the local state
            setGenerations((prev) =>
              prev.map((gen) =>
                gen.id === generation.id
                  ? {
                      ...gen,
                      status: "completed",
                      videoUrl: result.output.video.url,
                    }
                  : gen,
              ),
            )

            clearInterval(intervalId)
          } else if (result.status === "failed") {
            setGenerations((prev) =>
              prev.map((gen) =>
                gen.id === generation.id ? { ...gen, status: "failed" } : gen,
              ),
            )

            clearInterval(intervalId)
          }
        } catch (error) {
          console.error("Error polling for updates:", error)
        }
      }, 5000) // Poll every 5 seconds

      intervalIds.push(intervalId)
    })

    return () => {
      intervalIds.forEach((id) => clearInterval(id))
    }
  }, [generations])

  if (generations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No video generations yet
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {generations.map((generation) => (
        <MagicCard key={generation.id} className="min-w-full p-4">
          <Card className="overflow-hidden border-none shadow-none">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <Badge
                    variant={
                      generation.status === "completed"
                        ? "default"
                        : generation.status === "processing"
                          ? "secondary"
                          : generation.status === "failed"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {generation.status}
                  </Badge>
                  <Badge variant="outline">{generation.type}</Badge>
                </div>
                <p className="mb-2 line-clamp-2 text-sm">{generation.prompt}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(generation.createdAt).toLocaleString()}
                </p>
              </div>

              {generation.videoUrl && (
                <div className="relative aspect-video bg-black">
                  <video
                    src={generation.videoUrl}
                    controls
                    className="h-full max-h-[70vh] w-full object-contain"
                  />
                </div>
              )}

              {!generation.videoUrl && generation.imageUrl && (
                <div className="relative aspect-video bg-black">
                  <img
                    src={generation.imageUrl || "/placeholder.svg"}
                    alt={generation.prompt}
                    className="h-full w-full object-contain opacity-50"
                  />
                  {generation.status === "processing" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                    </div>
                  )}
                </div>
              )}

              {!generation.videoUrl && !generation.imageUrl && (
                <div className="relative flex aspect-video items-center justify-center bg-gray-900">
                  {generation.status === "processing" ? (
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                  ) : (
                    <p className="text-muted-foreground">
                      No preview available
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </MagicCard>
      ))}
    </div>
  )
}
