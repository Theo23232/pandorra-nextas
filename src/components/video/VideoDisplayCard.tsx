"use client"

import { AlertCircle, Download, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { createPublicationVideo } from "@/actions/pubVideo.actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface VideoDisplayCardProps {
  id: string
  status: string
  url: string
  failedMessage: string
  videoPrompt: string
  videoDuration: number
  videoRatio: string
}

export const VideoDisplayCard = ({
  id,
  status,
  url,
  failedMessage,
  videoPrompt,
  videoDuration,
  videoRatio,
}: VideoDisplayCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch((error) => {
          console.log("Autoplay failed:", error)
        })
      } else {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [isHovered])

  const handlePublicationVideo = async (
    id: string,
    url: string,
    prompt: string,
    videoDuration: number,
    videoRatio: string,
    status: string,
  ) => {
    try {
      console.log("here")

      const loadingToast = toast({
        title: "Loading",
        description: "Your video is being published",
        variant: "loading",
        disableDismiss: true,
      })
      await createPublicationVideo(
        id,
        url,
        prompt,
        videoDuration,
        videoRatio,
        status,
      )
        .then(() => {
          toast({
            title: "Success",
            description: "Your video has been published",
            variant: "success",
            duration: 3000,
          })
        })
        .catch(() => {
          toast({
            title: "A video cannot be published twice",
            description: "You have already posted this image",
            variant: "error",
          })
        })
        .finally(() => {
          loadingToast.dismiss()
        })
    } catch (error) {
      console.error("Erreur lors de la publication de la vidéo :", error)
    }
  }
  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute left-0 right-0 top-0 bg-gradient-to-b from-black/80 to-transparent p-5 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "z-40 opacity-0"
        }`}
      >
        <div className="absolute right-3 top-2 z-40 flex gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  className="z-40 size-10 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    //   handleDownload()
                  }}
                >
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  className="z-40 size-10 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePublicationVideo(
                      id,
                      url,
                      videoPrompt,
                      videoDuration,
                      videoRatio,
                      status,
                    )
                  }}
                >
                  <Send />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {status === "Generated" ? (
        <video
          ref={videoRef}
          src={url}
          className={`h-auto w-full transform transition-transform duration-1000 ease-in-out ${isHovered ? "scale-125" : ""}`}
          loop
          muted
          playsInline
          controls={false}
        />
      ) : status === "Pending" ? (
        <Skeleton />
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to generate video: {failedMessage || "Unknown error"}
          </AlertDescription>
        </Alert>
      )}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-md font-semibold text-white">{videoPrompt}</p>
      </div>
    </div>
  )
}
