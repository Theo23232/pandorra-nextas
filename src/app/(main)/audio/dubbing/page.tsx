"use client"

import { ArrowRight, Mic, Pause, Play, StopCircle, Upload } from "lucide-react"
import { useOnborda } from "onborda"
import { useEffect, useRef, useState } from "react"

import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUser } from "@/hooks/use-user"
import { languageOptions } from "@/lib/elevenlabs/langList"

export default function RouterPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [targetLang, setTargetLang] = useState("en")
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const { user } = useUser()
  const { startOnborda } = useOnborda()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" })
        const url = URL.createObjectURL(blob)
        setAudioURL(url)
        setMediaFile(
          new File([blob], "recorded-audio.wav", { type: "audio/wav" }),
        )
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Error accessing microphone:", err)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      setAudioURL(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setMediaFile(file)
      setAudioURL(URL.createObjectURL(file))
    }
  }

  const togglePlayback = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause()
      } else {
        mediaRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleCreateDub = async () => {
    if (!mediaFile) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", mediaFile)
    formData.append("target_lang", targetLang)

    try {
      const response = await fetch("https://api.elevenlabs.io/v1/dubbing", {
        method: "POST",
        headers: {
          "xi-api-key": process.env.NEXT_PUBLIC_XI_API_KEY || "",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Dubbing conversion failed")
      }

      const chunks: Uint8Array[] = []
      const reader = response.body?.getReader()

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) chunks.push(value)
      }

      const blob = new Blob(chunks, { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      // Assuming these functions exist in your application
      // await generateVoiceChange(url, targetLang)
      // mutate("/api/audio/voice-change")
      setAudioURL(url)
    } catch (error) {
      console.error("Conversion error", error)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    if (user) {
      const tourOnboarding = user.tourOnboarding
      console.log(tourOnboarding)
      if (
        !tourOnboarding.includes("twelfthtour") &&
        !tourOnboarding.includes("stop")
      ) {
        startOnborda("twelfthtour")
      }
    }
  }, [user, startOnborda])

  return (
    <div className="max-w-xl">
      <MagicCard className="p-4">
        <div className="space-y-6">
          <div id="tour12-step1">
            <label className="mb-2 block text-sm font-medium">
              Project name
            </label>
            <Input placeholder="Untitled project" />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Source Language*
              </label>
              <Select>
                <SelectTrigger id="tour12-step2">
                  <SelectValue placeholder="Detect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detect">Detect</SelectItem>
                  {languageOptions.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ArrowRight className="mt-7 h-4 w-4 text-gray-400" />
            <div>
              <label className="mb-2 block text-sm font-medium">
                Target Languages*
              </label>
              <Select onValueChange={(value) => setTargetLang(value)}>
                <SelectTrigger id="tour12-step3">
                  <SelectValue placeholder="Select languages" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((l) => (
                    <SelectItem key={l.label} value={l.code}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Audio or video source*
            </label>

            <Card className="border-dashed" id="tour12-step4">
              <CardContent className="py-8">
                {!mediaFile && !isRecording ? (
                  <div
                    className="flex flex-col items-center justify-center text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="mb-1 text-sm font-medium">
                      Click or drag to upload here
                    </p>
                    <p className="text-sm text-gray-500">
                      Audio or video file, up to 500MB or 45 minutes
                    </p>
                    <input
                      type="file"
                      accept="audio/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        if (!isRecording) {
                          startRecording()
                        } else {
                          stopRecording()
                        }
                      }}
                    >
                      {isRecording ? (
                        <>
                          <StopCircle className="mr-2 h-4 w-4" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    {mediaFile?.type.startsWith("video/") ? (
                      <video
                        ref={mediaRef as React.RefObject<HTMLVideoElement>}
                        src={audioURL!}
                        controls
                        className="max-w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <audio
                          ref={mediaRef as React.RefObject<HTMLAudioElement>}
                          src={audioURL!}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={togglePlayback}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="text-sm">
                          {mediaFile?.name || "Recorded Audio"}
                        </span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMediaFile(null)
                        setAudioURL(null)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <p className="mt-2 text-xs text-gray-500">
              Your video will be dubbed in standard resolution and will include
              a watermark. Only Creator+ plans can change this.{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Upgrade your plan
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div id="tour12-step5">
              <label className="mb-2 block text-sm font-medium">
                Number of speakers
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Detect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detect">Detect</SelectItem>
                  {[...Array(9)].map((_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div id="tour12-step6">
              <label className="mb-2 block text-sm font-medium">
                Time range to dub
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="hh:mm:ss" />
                <Input placeholder="hh:mm:ss" />
              </div>
            </div>
          </div>

          <Button
            id="tour12-step7"
            className="w-full bg-gray-400 hover:bg-gray-500"
            onClick={handleCreateDub}
            disabled={!mediaFile || isLoading}
          >
            {isLoading ? "Converting..." : "Create dub"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Credits remaining before this dub: 9,115
          </p>
        </div>
      </MagicCard>
    </div>
  )
}
