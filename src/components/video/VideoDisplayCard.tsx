"use client"

import { AlertCircle, Download, Loader, Send, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mutate } from 'swr';

import { createPublicationVideo } from '@/actions/pubVideo.actions';
import { deleteVideoGenerated } from '@/actions/runway.actions';
import Bounce from '@/components/animated/uibeats/bounce';
import { Tooltip } from '@/components/tremor/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

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
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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

  useEffect(() => {
    if (status === "Pending") {
      const interval = setInterval(() => {
        mutate("/api/video")
      }, 1000)

      return () => clearInterval(interval) // Nettoyage de l'intervalle quand le composant est démonté ou le statut change
    }
  }, [status])

  const handlePublicationVideo = async (
    id: string,
    url: string,
    prompt: string,
    videoDuration: number,
    videoRatio: string,
    status: string,
  ) => {
    try {
      const loadingToast = toast({
        title: t(`Loading`),
        description: t(`Your video is being published`),
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
            title: t(`Success`),
            description: t(`Your video has been published`),
            variant: "success",
            duration: 3000,
          })
        })
        .catch(() => {
          toast({
            title: t(`A video cannot be published twice`),
            description: t(`You have already posted this video`),
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

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
      const response = await fetch(proxyUrl)
      const blob = await response.blob()
      const originalFileName = url.split("/").pop() || "video.mp4"
      const fileName = `Pandorra.ai_${originalFileName}`
      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Erreur lors du téléchargement de la vidéo :", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteVideoGenerated(id)
      mutate("/api/video")
      toast({
        title: t(`Success`),
        description: t(`Your video has been deleted`),
        variant: "success",
        duration: 3000,
      })
    } catch (error) {
      console.error("Erreur lors de la suppression de la vidéo :", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (status === "Pending") {
    return (
      <Bounce
        className="relative h-[500px] w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-accent shadow-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <div className="relative h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)] dark:border-sky-400"></div>
          <p> {t(`Generation in progress`)}</p>
        </div>
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Tooltip content={videoPrompt} className="max-w-xl">
            <p className="truncate-2-lines line-clamp-3 text-left text-white/80">
              {videoPrompt}
            </p>
          </Tooltip>
        </div>
      </Bounce>
      // <Alert variant="default" className="rounded-md border border-border">

      //   <AlertDescription>
      //      {t(videoPrompt)}
      //   </AlertDescription>
      // </Alert>
    )
  } else if (status === "Failed") {
    return (
      <Alert variant="destructive" className="rounded-md border border-border">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t(`Failed to generate video:`)} {t(failedMessage || "Unknown error")}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Bounce
          className="relative w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-accent shadow-sm"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`absolute left-0 right-0 top-0 p-5 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "z-40 opacity-0"
            }`}
          >
            <div className="absolute right-3 top-2 z-40 flex gap-3">
              <Tooltip content={t(`Delete`)}>
                <Button
                  size={"icon"}
                  variant="magicDestructive"
                  className="z-40 size-10 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Trash />
                  )}
                </Button>
              </Tooltip>
              <Tooltip content={t(`Download`)}>
                <Button
                  size={"icon"}
                  className="z-40 size-10 rounded-full p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload()
                  }}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Download />
                  )}
                </Button>
              </Tooltip>
              <Tooltip content={t(`Post`)}>
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
              </Tooltip>
            </div>
          </div>
          {status === "Generated" && (
            <video
              id="tour8-step6"
              ref={videoRef}
              src={url}
              className={`h-auto w-full transform transition-transform duration-1000 ease-in-out ${isHovered ? "scale-105" : ""}`}
              loop
              muted
              playsInline
              controls={false}
            />
          )}

          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Tooltip content={videoPrompt} className="max-w-xl">
              <p className="truncate-2-lines line-clamp-3 text-left text-white/80">
                {videoPrompt}
              </p>
            </Tooltip>
          </div>
        </Bounce>
      </DialogTrigger>
      <DialogContent className="flex max-w-4xl items-center justify-center bg-transparent">
        <video
          src={url}
          className={`max-h-[90vh] max-w-3xl rounded`}
          loop
          muted
          controls={true}
        />
      </DialogContent>
    </Dialog>
  )
}
