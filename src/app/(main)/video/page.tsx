"use client"

import { AlertCircle, Upload } from "lucide-react"
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

export default function Page() {
  const { data: histories } = useSWR<Video[]>("/api/video", fetcher)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [promptText, setPromptText] = useState("")
  const [duration, setDuration] = useState("5")
  const [ratio, setRatio] = useState("1280:768")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const charCount = prompt.length
  const maxChars = 9680
  const [isEnhancing, setIsEnhancing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const interval = setInterval(() => {
      mutate("/api/video")
    }, 1000) // Check for updates every 5 seconds

    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    mutate("/api/video")
  }, [histories])

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
    if (!image && !promptText)
      return alert("Sélectionne une image ou ajoute un texte pour le prompt")

    setLoading(true)

    const base64Image = image
      ? await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(image)
          reader.onload = () => resolve(reader.result as string)
        })
      : "https://pandorra.ai/assets/fond.png"

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

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto" // Réinitialiser pour recalculer
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
      const enhancePrompt = async () => {
        setIsEnhancing(true)
        try {
          const promptEnhanced = await enhanceVideoPrompt(promptText)
          setPromptText(promptEnhanced)
        } catch (error) {
          toast({
            title: " toastTitle",
            description: "Prompt enhancement failed",
            variant: "error",
            duration: 3000,
          })
        } finally {
          setIsEnhancing(false)
        }
      }
    }
  }
  return (
    <div className="flex w-full max-w-7xl flex-col gap-4">
      <MagicCard className="max-w-3xl">
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          className="w-full resize-none overflow-hidden border-0 pt-4 text-xl shadow-none focus-visible:ring-0"
          placeholder="Describe the video you want..."
        />
        <div className="flex justify-between p-4">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-4">
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 s</SelectItem>
                  <SelectItem value="10">10 s</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratio} onValueChange={setRatio}>
                <SelectTrigger className="w-[125px]">
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1280:768">Landscape</SelectItem>
                  <SelectItem value="768:1280">Portrait</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="image-upload"
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Upload className="h-5 w-5" />
                  {image ? (
                    <p>
                      Image selected. <br /> Click to change image
                    </p>
                  ) : (
                    "Upload Image"
                  )}
                </Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <div className="text-sm text-muted-foreground">
              {charCount.toLocaleString()} / {maxChars.toLocaleString()}
            </div> */}
            <Button className="text-md h-10">Generate Video</Button>
          </div>
        </div>
      </MagicCard>
      <MagicCard className="max-w-3xl p-4">
        <div className="flex h-fit flex-[2] flex-col overflow-hidden">
          <div className="h-full overflow-y-auto">
            {histories && (
              <>
                {histories.map((video) => {
                  if (video.status === "Pending") {
                    return (
                      <div key={video.id} className="mb-6 space-y-4">
                        <h3 className="text-xl font-medium">Pending</h3>
                        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
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
                              <span className="text-muted-foreground">
                                Prompt:
                              </span>
                              <Badge>{video.prompt}</Badge>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Duration:
                              </span>
                              <Badge>{video.duration} secondes</Badge>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="text-muted-foreground">
                                Status:
                              </span>
                              <Badge>Pending</Badge>
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  } else if (video.status === "Failed") {
                    return (
                      <div key={video.id} className="mb-6 space-y-4">
                        <h3 className="text-xl font-medium">Failed</h3>
                        <Alert variant="destructive">
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
                                <strong>Duration:</strong> {video.duration}{" "}
                                seconds
                              </p>
                              <p>
                                <strong>Error:</strong>{" "}
                                {"An unknown error occurred"}
                              </p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      </div>
                    )
                  } else if (video.status === "Generated") {
                    return (
                      <div key={video.id} className="mb-4 space-y-4">
                        {/* <h3 className="text-xl font-medium">Generated</h3> */}
                        <div className="flex flex-col space-y-4">
                          <div className="overflow-hidden rounded-lg border border-border shadow-sm">
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
                                <Badge className="overflow-hidden whitespace-pre-wrap break-words">
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
                                <span className="text-muted-foreground">
                                  Date:
                                </span>
                                <Badge>
                                  {new Date(video.createdAt).toLocaleString()}
                                </Badge>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </>
            )}
          </div>
        </div>
      </MagicCard>
    </div>
  )
}
