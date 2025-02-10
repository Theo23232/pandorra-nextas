/* eslint-disable @next/next/no-img-element */
"use client"

import { AlertCircle, Upload, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import useSWR, { mutate } from "swr"

import { enhanceVideoPrompt } from "@/actions/openai.actions"
import { generateVideoFromImage } from "@/actions/runway.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { Badge } from "@/components/tremor/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { fetcher } from "@/lib/utils"

import type { Video } from "@prisma/client"
import type React from "react"

const SkeletonLoader = () => (
  <div className="flex animate-pulse space-x-4">
    <div className="h-64 w-full rounded-lg bg-gray-300"></div>
  </div>
)

export default function VideoGenerator() {
  const { data: histories } = useSWR<Video[]>("/api/video", fetcher)
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [promptText, setPromptText] = useState("")
  const [duration, setDuration] = useState("5")
  const [ratio, setRatio] = useState("1280:768")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const interval = setInterval(() => mutate("/api/video"), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    mutate("/api/video")
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleImageChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleImageChange(e.dataTransfer.files[0])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e.target.files?.[0] || null)
  }

  const handleRemoveImage = () => {
    setImage(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async () => {
    if (!image && !promptText) {
      toast({
        title: "Error",
        description: "Please select an image or add text for the prompt",
        variant: "error",
      })
      return
    }

    setLoading(true)

    const base64Image = image
      ? await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(image)
          reader.onload = () => resolve(reader.result as string)
        })
      : "https://pandorra.ai/assets/fond.png"

    try {
      const videoDuration = duration === "5" ? 5 : 10
      const videoRatio = ratio === "768:1280" ? "768:1280" : "1280:768"

      await generateVideoFromImage(
        base64Image,
        promptText,
        videoDuration,
        videoRatio,
      )
      mutate("/api/video")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate video",
        variant: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageChange(e.target.files[0])
      try {
        const enhancedPrompt = await enhanceVideoPrompt(promptText)
        setPromptText(enhancedPrompt)
      } catch (error) {
        toast({
          title: "Error",
          description: "Prompt enhancement failed",
          variant: "error",
        })
      }
    }
  }

  return (
    <div className="flex w-full max-w-7xl flex-col gap-8">
      <MagicCard className="overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-lg">
        <Textarea
          ref={textareaRef}
          value={promptText}
          onChange={handleInput}
          className="mb-4 w-full resize-none overflow-hidden border-0 bg-transparent text-xl shadow-none focus-visible:ring-0"
          placeholder="Describe the video you want..."
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 seconds</SelectItem>
                <SelectItem value="10">10 seconds</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratio} onValueChange={setRatio}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Aspect Ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1280:768">Landscape</SelectItem>
                <SelectItem value="768:1280">Portrait</SelectItem>
              </SelectContent>
            </Select>
            <Label
              htmlFor="image-upload"
              className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <Upload className="h-5 w-5" />
              <span>{previewUrl ? "Change image" : "Upload image"}</span>
            </Label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 text-white transition-all hover:from-purple-700 hover:to-indigo-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Generate Video"}
          </Button>
        </div>
        {previewUrl && (
          <div className="relative mt-6">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Uploaded image preview"
              className="max-h-64 w-full rounded-lg object-contain shadow-md"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md transition-colors hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </MagicCard>

      <MagicCard className="bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Video History
        </h2>
        <div className="space-y-6">
          {histories?.map((video) => (
            <div
              key={video.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              {video.status === "Generated" ? (
                <video src={video.url} controls className="h-auto w-full" />
              ) : video.status === "Pending" ? (
                <SkeletonLoader />
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to generate video:{" "}
                    {video.failedMessage || "Unknown error"}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2 p-4">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Prompt:</span>
                  <span className="text-gray-600">{video.prompt}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral">{video.duration} seconds</Badge>
                  <Badge variant="neutral">
                    {video.ratio}{" "}
                    {video.ratio === "1280:768" ? "(Landscape)" : "(Portrait)"}
                  </Badge>
                  <Badge variant="neutral">{video.status}</Badge>
                  {video.status === "Generated" && (
                    <Badge variant="neutral">
                      {new Date(video.createdAt).toLocaleString()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </MagicCard>
    </div>
  )
}
