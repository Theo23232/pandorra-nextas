// Page.tsx
"use client"
import * as Flags from 'country-flag-icons/react/3x2';
import { ElevenLabsClient } from 'elevenlabs';
import { useSearchParams } from 'next/navigation';
import { useOnborda } from 'onborda';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR, { mutate } from 'swr';

import { reduceCredit, verifyCredit } from '@/actions/credits.actions';
import { generateTTS } from '@/actions/elevenlabs.actions';
import { MagicCard } from '@/components/animated/magic-ui/magic-card';
import { NothingYet } from '@/components/NothingYet';
import { Button } from '@/components/tremor/ui/button';
import { CardTitle } from '@/components/tremor/ui/card';
import { Divider } from '@/components/tremor/ui/divider';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { languageOptions } from '@/lib/elevenlabs/langList';
import { getVoiceNameById, VoiceDetails, voicesList as vlist } from '@/lib/elevenlabs/voiceList';
import { fetcher } from '@/lib/utils';
import { TTS } from '@prisma/client';

import { AudioPlayer } from '../audio-player'; // Assurez-vous du bon chemin d'importation

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
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const queryPrompt = searchParams?.get("prompt")

  const { data } = useSWR<TTS[]>("/api/audio/generated-tts", fetcher)
  const [prompt, setPrompt] = useState(queryPrompt || "")
  const [durationSeconds, setDurationSeconds] = useState(8)
  const [isAuto, setIsAuto] = useState(true)
  const [credit, setCredit] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [influence, setInfluence] = useState(30)
  const [stability, setStability] = useState(0)
  const [similarity, setSimilarity] = useState(0)
  const [style, setStyle] = useState(0)
  const { user } = useUser()
  const { startOnborda } = useOnborda()

  const [voicesList, setVoicesList] = useState<VoiceDetails[]>(vlist)
  const [voiceId, setVoiceId] = useState(vlist[0].id)
  const [lang, setLang] = useState("en")
  const charCount = prompt.length
  const maxChars = 9680
  const { toast } = useToast()

  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const getLanguageName = (code: string) => {
    const language = languageOptions.find((item) => item.code === code)
    return language ? language.label : code
  }

  const getVoiceName = (id: string) => {
    const voice = voicesList.find((item) => item.id === id)
    return voice ? voice.name : id
  }

  const handleToken = async (duration: number) => {
    const isEnoughtToken = await verifyCredit(duration)
    if (!isEnoughtToken) {
      toast({
        title: t(`Error`),
        description: t(`You do not have enought token for this generation`),
        variant: "error",
      })
      setIsLoading(false)
      throw new Error("")
    }
    await reduceCredit(duration)
  }

  function estimateSpeechDuration(
    text: string,
    wordsPerMinute: number = 140,
  ): number {
    if (!text) return 0

    const wordCount = text.split(/\s+/).length
    const wordsPerSecond = wordsPerMinute / 60
    return Math.floor(wordCount / wordsPerSecond)
  }

  useEffect(() => {
    const durationSecond = estimateSpeechDuration(prompt)
    setCredit(durationSecond)
  }, [prompt])

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      await handleToken(credit)
      const client = new ElevenLabsClient({
        apiKey: process.env.NEXT_PUBLIC_XI_API_KEY,
      })

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
      mutate("/api/auth/session")
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

  useEffect(() => {
    if (user) {
      const tourOnboarding = user.tourOnboarding
      if (
        !tourOnboarding.includes("tenthtour") &&
        !tourOnboarding.includes("stop")
      ) {
        startOnborda("tenthtour")
      }
    }
  }, [user, startOnborda])

  const handleVoiceSelect = (
    voiceId: string,
    language: string,
    name: string,
  ) => {
    setVoiceId(voiceId)
    setVoicesList((prevVoices) => {
      // Check if the voice already exists to avoid duplicates
      const existingVoice = prevVoices.find((voice) => voice.id === voiceId)
      if (existingVoice) return prevVoices

      // Create a new voice object that matches VoiceDetails interface
      const newVoice: VoiceDetails = {
        id: voiceId,
        name: name,
        category: "user-selected",
        language: language,
        accent: "",
        description: "",
        age: "",
        gender: "",
        use_case: "",
        preview_url: "",
      }

      return [...prevVoices, newVoice]
    })
    setLang(language)
  }
  const ExampleButton = ({ text, title }: { text: string; title: string }) => (
    <Button
      variant="outline"
      className="h-10 rounded-md text-sm text-foreground"
      onClick={() => setPrompt(t(text))}
    >
      {t(title)}
    </Button>
  )

  return (
    <div className="w-full max-w-3xl">
      <MagicCard>
        <Textarea
          id="tour10-step1"
          ref={textareaRef}
          value={prompt}
          onChange={handleInput}
          className="w-full resize-none overflow-hidden border-0 pt-4 text-xl shadow-none focus-visible:ring-0"
          placeholder={t(`Describe the sound you want...`)}
        />
        <div className="flex items-center justify-between gap-2 p-4 max-sm:flex-wrap">
          <div className="flex items-center gap-2">
            <Select value={voiceId} onValueChange={setVoiceId}>
              <SelectTrigger
                className="h-10 sm:w-full lg:w-[120px]"
                id="tour10-step2"
              >
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
              <SelectTrigger className="h-10 w-[180px]" id="tour10-step3">
                <SelectValue placeholder={t(`Select Language`)} />
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

          <Button
            id="tour10-step4"
            className="text-md h-10 max-sm:w-full"
            onClick={handleGenerate}
            isLoading={isLoading}
          >
            {t(`Generate voice`)}
            <span className="ml-1 flex items-center justify-center">
              {credit} <img src="/coin.png" className="ml-0.5 h-5 w-auto" />
            </span>
          </Button>
        </div>
      </MagicCard>

      <MagicCard className="mt-4 p-4">
        <div className="text-center text-muted-foreground">
          {t(`Or try out an example to get started!`)}
        </div>
        <div
          className="mt-4 flex flex-wrap justify-center gap-2"
          id="tour10-step5"
        >
          {textToSpeechExamples.map((e) => (
            <ExampleButton key={e.title} text={e.text} title={e.title} />
          ))}
        </div>
      </MagicCard>

      {!(data?.length === 0) ? (
        <MagicCard className="mt-4 flex flex-col gap-2 p-5">
          {data?.map((audio, index) => {
            const CountryFlag = Flags[languageToCountry[audio.lang] || "GB"]
            return (
              <div className="pt-2" key={audio.id} id="tour10-step6">
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
        <div id="tour10-step6" className="mt-4">
          <NothingYet
            subtitle={t(`Your voice generation will be displayed here`)}
            title={t(`There is no audio yet`)}
          />
        </div>
      )}
    </div>
  )
}
