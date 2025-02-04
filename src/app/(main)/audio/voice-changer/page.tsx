"use client"
import React, { DragEvent, useRef, useState } from "react"
import useSWR, { mutate } from "swr"

import { generateVoiceChange } from "@/actions/elevenlabs.actions"
import { AudioPlayer } from "@/app/(main)/audio/audio-player"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tremor/inputs/select"
import { Button } from "@/components/tremor/ui/button"
import { Divider } from "@/components/tremor/ui/divider"
import { voicesList } from "@/lib/elevenlabs/voiceList"
import { fetcher } from "@/lib/utils"
import { VoiceChange } from "@prisma/client"

interface SpeechToSpeechProps {
  apiKey: string
  voiceId: string
}

const SpeechToSpeechConverter = () => {
  const { data } = useSWR<VoiceChange[]>("/api/audio/voice-change", fetcher)

  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [voiceId, setVoiceId] = useState(voicesList[0].id)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = handleConvert
      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      convertAudio(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      convertAudio(file)
    }
  }

  const handleConvert = () => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
      convertAudio(audioBlob)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      convertAudio(e.target.files[0])
    }
  }

  const convertAudio = async (audioFile: Blob) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("audio", audioFile, "recording.webm")
    formData.append("model_id", "eleven_multilingual_sts_v2")

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/speech-to-speech/${voiceId}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: {
            "xi-api-key": process.env.NEXT_PUBLIC_XI_API_KEY || "",
          },
          body: formData,
        },
      )

      console.log("response ==> ", response)

      if (!response.ok) {
        throw new Error("Speech-to-speech conversion failed")
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
      await generateVoiceChange(url, voiceId)
      mutate("/api/audio/voice-change")
      setAudioUrl(url)
    } catch (error) {
      console.error("Conversion error", error)
    }
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-3xl">
      <MagicCard className="p-4">
        <h2 className="mb-4 text-xl font-bold">Voice Converter</h2>

        <div className="mb-4 flex items-center justify-center space-x-2">
          <Select value={voiceId} onValueChange={setVoiceId}>
            <SelectTrigger className="h-[50px] w-full">
              <SelectValue placeholder="Select Voice" />
            </SelectTrigger>
            <SelectContent>
              {voicesList.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={!isRecording ? "primary" : "destructive"}
            isLoading={isLoading}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>

          <input
            type="file"
            ref={inputRef}
            accept="audio/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-300 ${
            dragActive
              ? "border-primary bg-blue-50"
              : "border-muted hover:border-primary"
          } `}
        >
          <p className="mb-2 text-gray-600">Drag and drop audio file here</p>
          <Button
            onClick={() => inputRef.current?.click()}
            isLoading={isLoading}
          >
            Or Select File
          </Button>
        </div>
      </MagicCard>

      {data ? (
        <MagicCard className="mt-4 flex flex-col gap-2 p-4">
          {data?.map((audio) => (
            <div className="" key={audio.id}>
              <AudioPlayer
                audioUrl={audio.url}
                className="p-0 pt-4 shadow-none"
              />
              <Divider />
            </div>
          ))}
        </MagicCard>
      ) : (
        <></>
      )}
    </div>
  )
}

export default SpeechToSpeechConverter
