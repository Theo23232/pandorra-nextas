"use client"

import { AlertCircle, Info, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import useSWR, { mutate } from "swr"

import { generateVideoFromImage } from "@/actions/runway.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { Badge } from "@/components/tremor/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { fetcher } from "@/lib/utils"

import type { Video } from "@prisma/client"
import type React from "react"

const SkeletonLoader = () => (
  <div className="flex animate-pulse space-x-4">
    <div className="h-64 w-full rounded-lg bg-gray-300"></div>
  </div>
)

export default function Page() {
  const { data: histories } = useSWR<Video[]>("/api/video", fetcher)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [promptText, setPromptText] = useState("")
  const [duration, setDuration] = useState("5")
  const [resolutionRatio, setResolutionRatio] = useState("1280:768")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      mutate("/api/video")
    }, 1000) // Check for updates every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleReset = () => {
    setImage(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!image) return alert("Sélectionne une image")
    if (!promptText) return alert("Ajoute un texte pour le prompt")

    setLoading(true)

    const reader = new FileReader()
    reader.readAsDataURL(image)
    reader.onload = async () => {
      const base64Image = reader.result as string

      try {
        const videoDuration: 5 | 10 = duration === "5" ? 5 : 10

        const data = await generateVideoFromImage(
          base64Image,
          promptText,
          videoDuration,
        )
        mutate("/api/video")
      } catch (error) {
        alert("Erreur lors de la génération de la vidéo")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex w-full max-w-7xl gap-8">
      <MagicCard className="flex-1 p-4">
        <div
          className="relative flex h-64 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
        >
          {preview ? (
            <>
              <Image
                src={preview || "/placeholder.svg"}
                alt="Preview"
                fill
                className="rounded-lg object-contain"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  handleReset()
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <p className="text-xl text-muted-foreground">
              Drag an image here, or click to select
            </p>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <p className="text-sm">prompt</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      This should describe in detail what should appear in the
                      output.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              type="text"
              placeholder="Enter text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <p className="text-sm">duration</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={14} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      The number of seconds of duration for the output video.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 seconds</SelectItem>
                <SelectItem value="10">10 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            {image && (
              <div className="text-sm text-muted-foreground">
                {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            <Button
              className="text-md ml-auto h-9 w-full"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Processing..." : "Generate Video"}
            </Button>
          </div>
        </div>
      </MagicCard>

      <MagicCard className="max-w-3xl p-4">
        <ScrollArea className="flex h-[calc(100vh-8rem)] flex-[2] flex-col overflow-hidden">
          <div className="h-full overflow-y-auto">
            {/* Pending Videos */}
            {histories?.some((video) => video.status === "Pending") && (
              <div className="mb-6 space-y-4">
                <h3 className="text-xl font-medium">Pending</h3>
                {histories
                  .filter((video) => video.status === "Pending")
                  .map((video) => (
                    <div
                      key={video.id}
                      className="overflow-hidden rounded-lg border border-gray-200 shadow-sm"
                    >
                      {video.url ? (
                        <video
                          src={video.url}
                          controls
                          className="h-auto w-full"
                        />
                      ) : (
                        <SkeletonLoader />
                      )}
                      <div className="flex flex-col gap-4 p-4">
                        <p className="flex items-center gap-2">
                          <span className="text-muted-foreground">Prompt:</span>
                          <Badge>{video.prompt}</Badge>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            Duration:
                          </span>
                          <Badge>{video.duration} secondes</Badge>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge>Pending</Badge>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Failed Videos */}
            {histories?.some((video) => video.status === "Failed") && (
              <div className="mb-6 space-y-4">
                <h3 className="text-xl font-medium">Failed</h3>
                {histories
                  .filter((video) => video.status === "Failed")
                  .map((video) => (
                    <Alert key={video.id} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="mt-1 space-y-1">
                          <p>
                            <strong>Prompt:</strong> {video.prompt}
                          </p>
                          <p>
                            <strong>Status:</strong> {video.status}
                          </p>
                          <p>
                            <strong>Duration:</strong> {video.duration} seconds
                          </p>
                          <p>
                            <strong>Error:</strong>{" "}
                            {"An unknown error occurred"}
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            )}

            {/* Completed Videos */}
            {histories?.some((video) => video.status === "Generated") && (
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Generated</h3>
                <div className="flex flex-col space-y-4">
                  {histories
                    .filter((video) => video.status === "Generated")
                    .map((video) => (
                      <div
                        key={video.id}
                        className="overflow-hidden rounded-lg border border-gray-200 shadow-sm"
                      >
                        <video
                          src={video.url}
                          controls
                          className="h-fit w-full"
                        />
                        <div className="flex flex-col gap-4 p-4">
                          <p className="flex items-start gap-2">
                            <span className="text-muted-foreground">
                              Prompt:
                            </span>
                            <Badge className="w-[500px] overflow-hidden whitespace-pre-wrap break-words">
                              {video.prompt}
                            </Badge>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Duration:
                            </span>
                            <Badge>{video.duration} secondes</Badge>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-muted-foreground">Date:</span>
                            <Badge>
                              {new Date(video.createdAt).toLocaleString()}
                            </Badge>
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </MagicCard>
    </div>
  )
}
