// Page.tsx
"use client"
import * as Flags from "country-flag-icons/react/3x2"
import { ElevenLabsClient } from "elevenlabs"
import { Settings2 } from "lucide-react"
import React, { useRef, useState } from "react"
import useSWR, { mutate } from "swr"

import { generateTTS } from "@/actions/elevenlabs.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { VoiceLibrarySearch } from "@/components/audio/VoiceLibrarySearch"
import { NothingYet } from "@/components/NothingYet"
import { Label } from "@/components/tremor/inputs/label"
import { Slider } from "@/components/tremor/inputs/slider"
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
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { languageOptions } from "@/lib/elevenlabs/langList"
import { getVoiceNameById, voicesList } from "@/lib/elevenlabs/voiceList"
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

const getLanguageName = (code: string) => {
  const language = languageOptions.find((item) => item.code === code)
  return language ? language.label : code
}

const getVoiceName = (id: string) => {
  const voice = voicesList.find((item) => item.id === id)
  return voice ? voice.name : id
}

type TextToSpeechExample = {
  title: string
  text: string
}

const textToSpeechExamples: TextToSpeechExample[] = [
  {
    title: "Inspirational Quote",
    text: "The only limit to our realization of tomorrow is our doubts of today.",
  },
  {
    title: "Weather Update",
    text: "Today's weather forecast predicts sunny skies with a high of 25 degrees Celsius and a gentle breeze from the east.",
  },
  {
    title: "Tech News",
    text: "Artificial Intelligence continues to revolutionize industries, from healthcare to finance, by automating complex tasks and improving decision-making processes.",
  },
  {
    title: "Travel Guide",
    text: "Welcome to Paris, the City of Light. Don’t miss the iconic Eiffel Tower, the charming Montmartre district, and the world-famous Louvre Museum.",
  },
  {
    title: "Fun Fact",
    text: "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
  },
  {
    title: "Daily Affirmation",
    text: "I am capable, resilient, and ready to face any challenges that come my way.",
  },
  {
    title: "Historical Fact",
    text: "The Great Wall of China, built over several dynasties, stretches for more than 13,000 miles across the country.",
  },
  {
    title: "Motivational Thought",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  },
  {
    title: "Short Story Snippet",
    text: "As the sun set over the quiet village, the last rays of light painted the sky with hues of pink and gold, promising a brighter tomorrow.",
  },
  {
    title: "Health Tip",
    text: "Staying hydrated is essential for maintaining focus, energy levels, and overall well-being throughout the day.",
  },
  {
    title: "Joke",
    text: "Why don't skeletons fight each other? They don’t have the guts.",
  },
  {
    title: "Poem Excerpt",
    text: "Two roads diverged in a wood, and I— I took the one less traveled by, and that has made all the difference.",
  },
  {
    title: "Proverb",
    text: "The early bird catches the worm, but the second mouse gets the cheese.",
  },
  {
    title: "Philosophical Thought",
    text: "The unexamined life is not worth living.",
  },
  {
    title: "Nature Description",
    text: "The gentle breeze carried the scent of pine, as the leaves rustled softly beneath the golden canopy of autumn trees.",
  },
]
export default function Page() {
  const { data } = useSWR<TTS[]>("/api/audio/generated-tts", fetcher)
  const [prompt, setPrompt] = useState("")
  const [durationSeconds, setDurationSeconds] = useState(8)
  const [isAuto, setIsAuto] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [influence, setInfluence] = useState(30)
  const [stability, setStability] = useState(0)
  const [similarity, setSimilarity] = useState(0)
  const [style, setStyle] = useState(0)
  const [voiceId, setVoiceId] = useState(voicesList[0].id)
  const [lang, setLang] = useState("en")
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
        voice_settings: {
          stability: stability / 100,
          similarity_boost: similarity / 100,
          style: style / 100,
        },
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

  const handleSliderStabilityChange = (value: number[]) => {
    setStability(value[0]) // Prendre la première valeur du tableau
  }
  const handleSliderSimilarityChange = (value: number[]) => {
    setSimilarity(value[0]) // Prendre la première valeur du tableau
  }
  const handleSliderStyleChange = (value: number[]) => {
    setStyle(value[0]) // Prendre la première valeur du tableau
  }

  const handleReset = () => {
    setIsAuto(true)
    setInfluence(30)
    setStability(0)
    setSimilarity(0)
    setStyle(0)
  }

  const handleVoiceSelect = (voiceId: string, language: string) => {
    setVoiceId(voiceId)
    setLang(language)
  }

  const ExampleButton = ({ text, title }: { text: string; title: string }) => (
    <Button
      variant="outline"
      className="h-10 rounded-md text-sm text-foreground"
      onClick={() => setPrompt(text)}
    >
      {title}
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
                <Button variant="ghost" className="h-10">
                  <Settings2 />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="sm:max-w-lg">
                <DrawerHeader>
                  <DrawerTitle>Settings</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                  <div className="w-full max-w-md space-y-8 p-4">
                    {/* Search voice */}
                    <VoiceLibrarySearch onVoiceSelect={handleVoiceSelect} />
                    <div className="flex flex-col"></div>
                    {/* Section Durée */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-lg font-medium">
                          Paramètres vocaux
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Les paramètres vocaux remplacent les paramètres
                          enregistrés pour la voix donnée. Ils ne sont appliqués
                          que sur la demande donnée.
                        </p>
                      </div>
                      <div className="">
                        <div className="flex items-center gap-3">
                          <Label htmlFor="stability" className="text-sm">
                            Stabilité
                          </Label>
                          <Badge className="text-sm">{stability}</Badge>
                        </div>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[stability]}
                          onValueChange={handleSliderStabilityChange}
                          className="mt-5"
                        />
                        <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                          <span>More variable</span>
                          <span>More stable</span>
                        </div>
                      </div>
                      <div className="pt-6">
                        <div className="flex items-center gap-3">
                          <Label htmlFor="stability" className="text-sm">
                            Augmentation de la similarité
                          </Label>
                          <Badge className="text-sm">{similarity}</Badge>
                        </div>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[similarity]}
                          onValueChange={handleSliderSimilarityChange}
                          className="mt-5"
                        />
                        <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                          <span>low</span>
                          <span>high</span>
                        </div>
                      </div>
                      <div className="pt-6">
                        <div className="flex items-center gap-3">
                          <Label htmlFor="stability" className="text-sm">
                            Style exaggeration
                          </Label>
                          <Badge className="text-sm">{style}</Badge>
                        </div>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[style]}
                          onValueChange={handleSliderStyleChange}
                          className="mt-5"
                        />
                        <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                          <span>None</span>
                          <span>Exaggerated</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DrawerBody>
                <DrawerFooter className="mt-6">
                  <Button
                    className="mt-2 h-10 w-full sm:mt-0 sm:w-fit"
                    variant="secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>{" "}
                  <DrawerClose asChild></DrawerClose>
                  <DrawerClose asChild>
                    <Button
                      className="h-10 w-full sm:w-fit"
                      onClick={handleGenerate}
                      isLoading={isLoading}
                    >
                      Ok, got it!
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Select value={voiceId} onValueChange={setVoiceId}>
              <SelectTrigger className="h-10 w-[120px]">
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
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className="h-10 w-[180px]">
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
              className="text-md h-10"
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
          {textToSpeechExamples.map((e) => (
            <ExampleButton key={e.title} text={e.text} title={e.title} />
          ))}
        </div>
      </MagicCard>

      {data ? (
        <MagicCard className="mt-4 flex flex-col gap-2 p-5">
          {data?.map((audio, index) => {
            const CountryFlag = Flags[languageToCountry[audio.lang] || "GB"]
            return (
              <div className="pt-2" key={audio.id}>
                <CardTitle>{audio.prompt}</CardTitle>
                <AudioPlayer
                  audioUrl={audio.url}
                  className="p-0 pt-4 shadow-none"
                />
                <div className="mt-6 flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex h-10 items-center gap-2 rounded-md text-sm text-foreground"
                  >
                    <CountryFlag className="mr-1 h-4 w-4" />
                    {getLanguageName(audio.lang)}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-md text-sm text-foreground"
                  >
                    {getVoiceNameById(audio.voice)}
                  </Button>
                </div>
                {index < data.length - 1 && <Divider />}
              </div>
            )
          })}
        </MagicCard>
      ) : (
        <NothingYet
          subtitle="You voice generation will be displayed here"
          title="There is no audio yet"
        />
      )}
    </div>
  )
}
