"use client"

import * as Flags from 'country-flag-icons/react/3x2';
import { ElevenLabsClient } from 'elevenlabs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { VoiceCard } from '@/components/audio/VoiceCard';
import { Input } from '@/components/nyxb/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { languageOptions } from '@/lib/elevenlabs/langList';
import { voicesList } from '@/lib/elevenlabs/voiceList';
import { VoiceDefault, VoiceType } from '@/types/voices';
import { TabsTrigger } from '@radix-ui/react-tabs';

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

interface VoiceLibrarySearchProps {
  onVoiceSelect: (voiceId: string, language: string, name: string) => void
}
export const VoiceLibrarySearch = ({
  onVoiceSelect,
}: VoiceLibrarySearchProps) => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [allVoices, setAllVoices] = useState<VoiceType[]>([])
  const [defaultVoices, setDefaultVoices] = useState<VoiceDefault[]>([])
  const [activeGender, setActiveGender] = useState("")
  const [activeLang, setActiveLang] = useState("")
  const [loading, setLoading] = useState(true)

  const handleGenerate = async () => {
    setLoading(true)
    const client = new ElevenLabsClient({
      apiKey: process.env.NEXT_PUBLIC_XI_API_KEY,
    })

    const voicePromises = languageOptions.map((lang) =>
      Promise.all([
        client.voices.getShared({
          page_size: 1,
          gender: t(`male`),
          language: lang.code,
        }),
        client.voices.getShared({
          page_size: 1,
          gender: t(`female`),
          language: lang.code,
        }),
      ]),
    )

    const voiceResponses = await Promise.all(voicePromises)
    const combinedVoices = voiceResponses
      .flat()
      .flatMap((response) => response.voices)

    setAllVoices(combinedVoices)
    setLoading(false)
  }

  const filteredVoices = (voices) =>
    voices.filter(
      (voice) =>
        voice.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (activeGender ? voice.gender === activeGender : true) &&
        (activeLang ? voice.language === activeLang : true),
    )

  useEffect(() => {
    handleGenerate()
    setDefaultVoices(voicesList)
  }, [])

  return (
    <div className="">
      <Input
        className="h-12 rounded-xl"
        placeholder={t(`Search voices...`)}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Tabs defaultValue="default" className="max-w-md">
        <TabsList className="flex h-14 w-full items-center justify-start gap-2 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="h-7 rounded-lg px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {t(`All`)}
          </TabsTrigger>
          <TabsTrigger
            value="default"
            className="h-7 rounded-lg px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {t(`Default`)}
          </TabsTrigger>
          <Select onValueChange={(value) => setActiveGender(value)}>
            <SelectTrigger
              className={`h-7 w-[100px] rounded-lg border-none px-3 text-sm shadow-none focus:ring-0 focus:ring-offset-0 ${
                activeGender === t(`male`) || activeGender === t(`female`)
                  ? "bg-primary text-white"
                  : "bg-transparent"
              }`}
            >
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male" className="h-9">
                {t(`Male`)}
              </SelectItem>
              <SelectItem value="female" className="h-9">
                {t(`Female`)}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setActiveLang(value)}>
            <SelectTrigger
              className={`h-7 w-[180px] rounded-lg border-none px-3 text-sm shadow-none focus:ring-0 focus:ring-offset-0 ${
                activeLang !== "" ? "bg-primary text-white" : "bg-transparent"
              }`}
            >
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((item) => {
                const CountryFlag = Flags[languageToCountry[item.code] || "GB"]
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
        </TabsList>
        <TabsContent value="all">
          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-md font-medium text-muted-foreground">
                {t(`All Voices`)}
              </p>
              <button className="text-sm text-primary">{t(`View all`)}</button>
            </div>
            <div className="flex flex-col gap-2">
              {loading ? (
                <div className="flex flex-wrap gap-1">
                  {[...Array(10)].map((_, index) => (
                    <Skeleton key={index} />
                  ))}
                </div>
              ) : (
                filteredVoices(allVoices).map((voice) => (
                  <div
                    key={voice.voice_id}
                    onClick={() =>
                      onVoiceSelect(voice.voice_id, voice.language, voice.name)
                    }
                  >
                    <VoiceCard
                      id={voice.voice_id}
                      name={voice.name}
                      accent={voice.accent}
                      category={voice.category}
                      gender={voice.gender}
                      age={voice.age}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="default">
          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-md font-medium text-muted-foreground">
                {t(`Default Voices`)}
              </p>
              <button className="text-sm text-primary">{t(`View all`)}</button>
            </div>
            <div className="flex flex-col gap-2">
              {loading ? (
                <div className="flex flex-wrap gap-1">
                  {[...Array(10)].map((_, index) => (
                    <div
                      key={index}
                      className="h-10 w-24 animate-pulse rounded bg-gray-300"
                    ></div>
                  ))}
                </div>
              ) : (
                filteredVoices(defaultVoices).map((voice) => (
                  <div
                    key={voice.id}
                    onClick={() =>
                      onVoiceSelect(voice.id, voice.language, voice.name)
                    }
                  >
                    <VoiceCard
                      id={voice.id}
                      name={voice.name}
                      accent={voice.accent}
                      category={voice.category}
                      gender={voice.gender}
                      age={voice.age}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
