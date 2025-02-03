// Page.tsx
"use client"
import * as Flags from "country-flag-icons/react/3x2"
import { ElevenLabsClient } from "elevenlabs"
import {
  Building2,
  Car,
  Cat,
  Gamepad2,
  Mic2,
  Music,
  Settings2,
  Waves,
  Wind,
} from "lucide-react"
import React, { useRef, useState } from "react"
import useSWR, { mutate } from "swr"

import { generateTTS } from "@/actions/elevenlabs.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { InputNumber } from "@/components/input-number"
import { Label } from "@/components/tremor/inputs/label"
import { Slider } from "@/components/tremor/inputs/slider"
import { Switch } from "@/components/tremor/inputs/switch"
import { Button } from "@/components/tremor/ui/button"
import { CardTitle } from "@/components/tremor/ui/card"
import { Divider } from "@/components/tremor/ui/divider"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/tremor/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { languageOptions } from "@/lib/elevenlabs/langList"
import { voicesList } from "@/lib/elevenlabs/voiceList"
import { fetcher } from "@/lib/utils"
import { TTS } from "@prisma/client"

import { AudioPlayer } from "../audio-player" // Assurez-vous du bon chemin d'importation

const languageToCountry: { [key: string]: keyof typeof Flags } = {
  en: "GB",
  fr: "FR",
  ar: "SA",
  bg: "BG",
  zh: "CN",
  hr: "HR",
  da: "DK",
  de: "DE",
  el: "GR",
  hi: "IN",
  it: "IT",
  ja: "JP",
  ko: "KR",
  pl: "PL",
  pt: "PT",
  ms: "MY",
  ro: "RO",
  ru: "RU",
  es: "ES",
  sk: "SK",
  sv: "SE",
  tr: "TR",
  uk: "UA",
}

interface ConversationProps {
  preSelectedAgentId?: string
  preSelectedVoiceId?: string
  preSelectedLanguage?: string
}

export default function Page({
  preSelectedAgentId,
  preSelectedVoiceId,
  preSelectedLanguage,
}: ConversationProps) {
  const { data } = useSWR<TTS[]>("/api/audio/generated-tts", fetcher)
  const [prompt, setPrompt] = useState("a car whizzing by")
  const [durationSeconds, setDurationSeconds] = useState(8)
  const [isAuto, setIsAuto] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [influence, setInfluence] = useState(30)
  const [voiceId, setVoiceId] = useState(preSelectedVoiceId || voicesList[0].id)
  const [lang, setLang] = useState(preSelectedLanguage || "en")
  const charCount = prompt.length
  const maxChars = 9680

  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      const client = new ElevenLabsClient({
        apiKey: process.env.NEXT_PUBLIC_XI_API_KEY,
      })

      let option: any

      if (isAuto) {
        option = {
          text: prompt,
        }
      } else {
        option = {
          text: prompt,
          duration_seconds: durationSeconds,
          prompt_influence: influence / 100,
        }
      }
      const response = await client.textToSpeech.convert(voiceId, {
        output_format: "mp3_44100_128",
        text: prompt,
        model_id: "eleven_multilingual_v2",
      })

      const chunks: Uint8Array[] = []
      for await (const chunk of response) {
        chunks.push(chunk)
      }

      const blob = new Blob(chunks, { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      await generateTTS(prompt, url, lang, voiceId)
      mutate("/api/audio/generated-tts")
    } catch (error) {
      console.error("Erreur lors de la génération de l'audio :", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto" // Réinitialiser pour recalculer
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleSliderChange = (value: number[]) => {
    setInfluence(value[0]) // Prendre la première valeur du tableau
  }

  const handleReset = () => {
    setIsAuto(true)
    setInfluence(30)
  }

  const ExampleButton = ({ icon: Icon, text }: { icon: any; text: string }) => (
    <Button
      variant="outline"
      className="h-9 rounded-md text-sm text-foreground"
      onClick={() => setPrompt(text)}
    >
      {text}
    </Button>
  )

  return (
    <div className="w-full max-w-3xl">
      <MagicCard>
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          className="w-full resize-none overflow-hidden border-0 pt-4 text-xl shadow-none focus-visible:ring-0"
          placeholder="Describe the sound you want..."
        />
        <div className="flex items-center justify-between gap-2 p-4">
          <div className="flex items-center gap-2">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" className="h-9">
                  <Settings2 />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="sm:max-w-lg">
                <DrawerHeader>
                  <DrawerTitle>Settings</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                  <div className="w-full max-w-md space-y-8 p-4">
                    {/* Section Durée */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-lg font-medium">Duration</h2>
                        <p className="text-sm text-muted-foreground">
                          Définissez la durée souhaitée pour votre génération.
                          Choisissez entre 0.5 et 22 secondes.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="auto-length"
                          checked={isAuto}
                          onCheckedChange={setIsAuto}
                        />
                        <Label htmlFor="auto-length" className="text-sm">
                          Choisir automatiquement la meilleure durée
                        </Label>
                      </div>
                      <InputNumber
                        className="w-full"
                        max={22}
                        suffix=" seconds"
                        min={1}
                        value={durationSeconds}
                        onChange={(e) =>
                          setDurationSeconds(parseInt(e.target.value))
                        }
                        disabled={isAuto}
                      />
                    </div>

                    {/* Section Influence du Prompt */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-lg font-medium">
                          Prompt Influence
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Ajustez le curseur pour que votre génération adhère
                          parfaitement au prompt ou laisse un peu de place à la
                          créativité.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[influence]}
                          onValueChange={handleSliderChange}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>More Creative</span>
                          <span>Follow Prompt</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DrawerBody>
                <DrawerFooter className="mt-6">
                  <Button
                    className="mt-2 h-9 w-full sm:mt-0 sm:w-fit"
                    variant="secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>{" "}
                  <DrawerClose asChild></DrawerClose>
                  <DrawerClose asChild>
                    <Button
                      className="h-9 w-full sm:w-fit"
                      onClick={handleGenerate}
                      isLoading={isLoading}
                    >
                      Ok, got it!
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Select
              value={voiceId}
              onValueChange={setVoiceId}
              disabled={!!preSelectedVoiceId}
            >
              <SelectTrigger className="h-9 w-[120px]">
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
            <Select
              value={lang}
              onValueChange={setLang}
              disabled={!!preSelectedLanguage}
            >
              <SelectTrigger className="h-9 w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((item) => {
                  const CountryFlag =
                    Flags[languageToCountry[item.code] || "GB"]
                  return (
                    <SelectItem key={item.code} value={item.code}>
                      <div className="flex items-center gap-1">
                        <CountryFlag className="mr-1 h-4 w-4" />
                        {item.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {charCount.toLocaleString()} / {maxChars.toLocaleString()}
            </div>
            <Button
              className="text-md h-9"
              onClick={handleGenerate}
              isLoading={isLoading}
            >
              Generate Sound Effects
            </Button>
          </div>
        </div>
      </MagicCard>

      <MagicCard className="mt-4 p-4">
        <div className="text-center text-muted-foreground">
          Or try out an example to get started!
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <ExampleButton icon={Car} text="Car whizzing by" />
          <ExampleButton icon={Music} text="Percussion sounds" />
          <ExampleButton icon={Cat} text="Animal sounds" />
          <ExampleButton icon={Building2} text="City soundscapes" />
          <ExampleButton icon={Mic2} text="Person whispering" />
          <ExampleButton icon={Wind} text="Whooshes and movement" />
          <ExampleButton icon={Gamepad2} text="Retro video games" />
          <ExampleButton icon={Waves} text="Dramatic buildup" />
        </div>
      </MagicCard>

      {data ? (
        <MagicCard className="mt-4 flex flex-col gap-2 p-4">
          {data?.map((audio) => (
            <div className="pt-2" key={audio.id}>
              <CardTitle>{audio.prompt}</CardTitle>
              <AudioPlayer audioUrl={audio.url} />
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
