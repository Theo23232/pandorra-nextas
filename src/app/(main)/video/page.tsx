"use client"

import { AlertCircle, Loader2, X } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import useSWR, { mutate } from "swr"

import { generateVideoFromImage } from "@/actions/runway.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetcher } from "@/lib/utils"

import type { Video } from "@prisma/client"
import type React from "react"

export default function Page() {
  const { data: histories } = useSWR<Video[]>("/api/video", fetcher)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [promptText, setPromptText] = useState("")
  const [duration, setDuration] = useState("2")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
          <Input
            type="text"
            placeholder="Enter prompt text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between">
            {image && (
              <div className="text-sm text-muted-foreground">
                {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            <Button
              className="text-md ml-auto h-9"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Processing..." : "Generate Video"}
            </Button>
          </div>
        </div>
      </MagicCard>

      <MagicCard className="flex h-[calc(100vh-8rem)] flex-[2] flex-col overflow-hidden p-4">
        <div className="h-full overflow-y-auto">
          {/* Pending Videos */}
          {histories?.some((video) => video.status === "Pending") && (
            <div className="mb-6 space-y-4">
              <h3 className="text-xl font-medium">Pending</h3>
              {histories
                .filter((video) => video.status === "Pending")
                .map((video) => (
                  <Alert key={video.id}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertTitle>Processing</AlertTitle>
                    <AlertDescription>
                      Your video is being generated. This may take a few
                      minutes.
                    </AlertDescription>
                  </Alert>
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
                          <strong>Error:</strong> {"An unknown error occurred"}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
            </div>
          )}

          {/* Completed Videos */}
          {histories?.some(
            (video) => video.status === "Generated" && video.url,
          ) && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Generated</h3>
              <div className="flex flex-col space-y-4">
                {histories
                  .filter((video) => video.status === "Generated" && video.url)
                  .map((video) => (
                    <div
                      key={video.id}
                      className="overflow-hidden rounded-lg border border-gray-200 shadow-sm"
                    >
                      <video
                        src={video.url}
                        controls
                        className="h-auto w-full"
                      />
                      <div className="p-4">
                        <p className="text-sm text-gray-500">
                          Created: {new Date(video.createdAt).toLocaleString()}
                        </p>
                        <p className="mt-2 text-sm">
                          <strong>Prompt:</strong> {video.prompt}
                        </p>
                        <p className="text-sm">
                          <strong>Duration:</strong> {video.duration} seconds
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </MagicCard>
    </div>
  )
}
