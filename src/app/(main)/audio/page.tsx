"use client"
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

import { generateFX } from "@/actions/elevenlabs.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { InputNumber } from "@/components/input-number"
import { NothingYet } from "@/components/NothingYet"
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
import { Textarea } from "@/components/ui/textarea"
import { fetcher } from "@/lib/utils"
import { FX } from "@prisma/client"

import { AudioPlayer } from "./audio-player" // Assurez-vous du bon chemin d'importation

export default function Page() {
  const { data } = useSWR<FX[]>("/api/audio/generated-fx", fetcher)
  const [prompt, setPrompt] = useState("")
  const [durationSeconds, setDurationSeconds] = useState(8)
  const [isAuto, setIsAuto] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [influence, setInfluence] = useState(30)
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
      const response = await client.textToSoundEffects.convert(option)

      const chunks: Uint8Array[] = []
      for await (const chunk of response) {
        chunks.push(chunk)
      }

      const blob = new Blob(chunks, { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      await generateFX(prompt, url)
      mutate("/api/audio/generated-fx")
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
      className="h-10 rounded-md text-sm text-foreground"
      onClick={() => setPrompt(text)}
    >
      <Icon className="mr-2 h-4 w-4" />
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
        <div className="flex justify-between p-4">
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
                      <h2 className="text-lg font-medium">Prompt Influence</h2>
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
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {charCount.toLocaleString()} / {maxChars.toLocaleString()}
            </div>
            <Button className="text-md h-10" onClick={handleGenerate}>
              Generate Sound Effects
            </Button>
          </div>
        </div>
      </MagicCard>

      {/* Affichage du player audio uniquement si une URL est disponible */}
      {audioUrl && (
        <MagicCard className="mt-4 flex items-center justify-center">
          <AudioPlayer audioUrl={audioUrl} />
        </MagicCard>
      )}

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
        <MagicCard className="mt-4 p-4">
          {data?.map((audio) => (
            <div className="" key={audio.id}>
              <CardTitle>{audio.prompt}</CardTitle>
              <AudioPlayer
                audioUrl={audio.url}
                className="p-0 pt-4 shadow-none"
              />
              <Divider />
            </div>
          ))}
        </MagicCard>
      ) : (
        <NothingYet
          subtitle="Your FX generation will be displayed here"
          title="There is no FC yet"
        />
      )}
    </div>
  )
}
