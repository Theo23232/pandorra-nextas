/* eslint-disable @next/next/no-img-element */
"use client"

import { Upload, X } from "lucide-react"
import { useOnborda } from "onborda"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import Masonry from "react-masonry-css"
import useSWR, { mutate } from "swr"

import { enhanceVideoPrompt } from "@/actions/openai.actions"
import { generateVideoFromImage } from "@/actions/runway.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { NothingYet } from "@/components/NothingYet"
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
import { VideoDisplayCard } from "@/components/video/VideoDisplayCard"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { fetcher } from "@/lib/utils"

import type { Video } from "@prisma/client"
import type React from "react"

const SkeletonLoader = () => (
  <div className="flex animate-pulse space-x-4">
    <div className="h-64 w-full rounded-lg bg-gray-300"></div>
  </div>
)

export default function VideoGenerator() {
  const { t } = useTranslation()
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
  const { user } = useUser()
  const { startOnborda } = useOnborda()

  const handleImageChange = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
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
        title: t(`Error`),
        description: t(`Please select an image or add text for the prompt`),
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
        title: t(`Error`),
        description: t(`Failed to generate video`),
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
          title: t(`Error`),
          description: t(`Prompt enhancement failed`),
          variant: "error",
        })
      }
    }
  }

  useEffect(() => {
    if (user) {
      const tourOnboarding = user.tourOnboarding
      console.log(tourOnboarding)
      if (
        !tourOnboarding.includes("eighthtour") &&
        !tourOnboarding.includes("stop")
      ) {
        startOnborda("eighthtour")
      }
    }
  }, [user, startOnborda])

  return (
    <div className="flex w-full flex-col gap-8">
      <MagicCard className="overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-lg">
        <Textarea
          ref={textareaRef}
          value={promptText}
          onChange={handleInput}
          className="mb-4 w-full resize-none overflow-hidden border-0 bg-transparent text-xl shadow-none focus-visible:ring-0"
          id="tour8-step1"
          placeholder={t(`Describe the video you want...`)}
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-[100px]" id="tour8-step2">
                <SelectValue placeholder={t(`Duration`)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 {t(`seconds`)}</SelectItem>
                <SelectItem value="10">10 {t(`seconds`)}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratio} onValueChange={setRatio}>
              <SelectTrigger className="w-[140px]" id="tour8-step3">
                <SelectValue placeholder="Aspect Ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1280:768">{t(`Landscape`)}</SelectItem>
                <SelectItem value="768:1280">{t(`Portrait`)}</SelectItem>
              </SelectContent>
            </Select>
            <div className="" id="tour8-step4">
              <Label
                htmlFor="image-upload"
                className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                <Upload className="h-5 w-5" />
                <span>
                  {previewUrl ? t(`Change image`) : t(`Upload image`)}
                </span>
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
          </div>
          <Button
            id="tour8-step5"
            className="px-6 py-2 text-white transition-all"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? t(`Processing...`) : t(`Generate Video`)}
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

      {histories && histories.length > 0 ? (
        <Masonry
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
          breakpointCols={{
            default: 3,
            1440: 2,
            1200: 2,
            700: 1,
          }}
        >
          {histories.map((video) => (
            <VideoDisplayCard
              key={video.id}
              id={video.id}
              status={video.status}
              url={video.url}
              failedMessage={video.failedMessage!}
              videoPrompt={video.prompt}
              videoDuration={video.duration}
              videoRatio={video.ratio}
            />
          ))}
        </Masonry>
      ) : (
        <div className="" id="tour8-step6">
          <NothingYet
            subtitle="Your video generation will be displayed here"
            title="There is no video yet"
          />
        </div>
      )}
    </div>
  )
}
