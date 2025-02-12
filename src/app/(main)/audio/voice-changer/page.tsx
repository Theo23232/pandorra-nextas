"use client"
import { AlertCircle, Mic, Upload } from "lucide-react"
import { useOnborda } from "onborda"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import useSWR, { mutate } from "swr"

import { generateVoiceChange } from "@/actions/elevenlabs.actions"
import { AudioPlayer } from "@/app/(main)/audio/audio-player"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { NothingYet } from "@/components/NothingYet"
import { Divider } from "@/components/tremor/ui/divider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { useAudioUploader } from "@/hooks/use-audio-uploader"
import { useUser } from "@/hooks/use-user"
import { voicesList } from "@/lib/elevenlabs/voiceList"
import { fetcher, formatTimePassed } from "@/lib/utils"

import type { VoiceChange } from "@prisma/client"
import type React from "react"
const SpeechToSpeechConverter: React.FC = () => {
  const { t } = useTranslation()
  const { data: voiceChanges } = useSWR<VoiceChange[]>(
    "/api/audio/voice-change",
    fetcher,
  )
  const [voiceId, setVoiceId] = useState(voicesList[0].id)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const { startOnborda } = useOnborda()

  const { isRecording, startRecording, stopRecording } = useAudioRecorder({
    onRecordingComplete: handleAudioConversion,
  })

  const { dragActive, handleDrag, handleDrop, triggerFileInput } =
    useAudioUploader({
      onFileSelected: handleAudioConversion,
    })

  async function handleAudioConversion(audioFile: Blob) {
    setIsLoading(true)
    setError(null)
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

      if (!response.ok) {
        throw new Error("Speech-to-speech conversion failed")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      await generateVoiceChange(url, voiceId)
      mutate("/api/audio/voice-change")
    } catch (error) {
      console.error("Conversion error", error)
      setError("An error occurred during voice conversion. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      const tourOnboarding = user.tourOnboarding
      console.log(tourOnboarding)
      if (
        !tourOnboarding.includes("eleventhtour") &&
        !tourOnboarding.includes("stop")
      ) {
        startOnborda("eleventhtour")
      }
    }
  }, [user, startOnborda])

  return (
    <div className="w-full max-w-3xl space-y-6">
      <MagicCard className="p-6">
        <h2 className="mb-6 text-2xl font-bold">{t(`Voice Converter`)}</h2>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select value={voiceId} onValueChange={setVoiceId}>
            <SelectTrigger className="h-[50px]" id="tour11-step1">
              <SelectValue placeholder={t(`Select Voice`)} />
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
            id="tour11-step2"
            onClick={isRecording ? stopRecording : startRecording}
            variant={!isRecording ? "default" : "destructive"}
            disabled={isLoading}
            className="h-[50px]"
          >
            <Mic className="mr-2 h-4 w-4" />
            {isRecording ? t(`Stop Recording`) : t(`Start Recording`)}
          </Button>
        </div>

        <div
          id="tour11-step3"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-300 ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted hover:border-primary"
          }`}
        >
          <p className="mb-4 text-muted-foreground">
            {t(`Drag and drop audio file here`)}
          </p>
          <Button onClick={triggerFileInput} disabled={isLoading}>
            <Upload className="mr-2 h-4 w-4" />
            {t(`Or Select File`)}
          </Button>
        </div>

        {error && (
          <div className="mt-4 flex items-center text-destructive">
            <AlertCircle className="mr-2 h-4 w-4" />
            <p>{error}</p>
          </div>
        )}
      </MagicCard>

      {voiceChanges && voiceChanges.length > 0 ? (
        <MagicCard className="p-6">
          <h3 className="mb-4 text-xl font-semibold">{t(`Converted Audio`)}</h3>
          <div className="space-y-4">
            {voiceChanges.map((audio) => {
              const timePassed = formatTimePassed(audio.createdAt.toString())
              return (
                <div key={audio.id} id="tour11-step4">
                  <Label className="pb-4">{timePassed}</Label>
                  <AudioPlayer
                    audioUrl={audio.url}
                    className="p-0 shadow-none"
                  />
                  <Divider className="my-4" />
                </div>
              )
            })}
          </div>
        </MagicCard>
      ) : (
        <NothingYet
          subtitle={t(`Your generation will be displayed here`)}
          title={t(`There is no voice yet`)}
        />
      )}
    </div>
  )
}

export default SpeechToSpeechConverter
