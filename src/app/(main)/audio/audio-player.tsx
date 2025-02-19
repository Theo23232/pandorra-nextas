"use client"

import {
  Download,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

type AudioPlayerProps = {
  audioUrl: string
  className?: string
}

export function AudioPlayer({ audioUrl, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () =>
      setProgress((audio.currentTime / audio.duration) * 100)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false)
      }
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [isLooping])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleLoop = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.loop = !isLooping
    setIsLooping(!isLooping)
  }

  const skipTime = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      audio.duration,
    )
  }

  const handleProgressChange = (newProgress: number) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (newProgress * audio.duration) / 100
    audio.currentTime = newTime
    setProgress(newProgress)
  }

  const handleDownload = () => {
    const a = document.createElement("a")
    a.href = audioUrl
    a.download = "audio.mp3" // You can customize the filename here
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div
      className={cn("audio-player w-full rounded-lg p-4 shadow-sm", className)}
    >
      <audio ref={audioRef} src={audioUrl} loop={isLooping} />

      <div className="space-y-3">
        <Slider
          value={[progress]}
          onValueChange={([value]) => handleProgressChange(value)}
          max={100}
          step={0.1}
          className="w-full"
        />

        <div className="mt-4 flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLoop}
            className={cn(
              "hover:bg-accent hover:text-accent-foreground",
              isLooping ? "text-primary" : "text-muted-foreground",
            )}
            aria-label="Toggle loop"
          >
            <Repeat className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => skipTime(-10)}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Skip backward 10 seconds"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={togglePlay}
            className="h-12 w-12 rounded-full shadow-md"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="ml-1 h-6 w-6" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => skipTime(10)}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Skip forward 10 seconds"
          >
            <SkipForward className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Download audio"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
