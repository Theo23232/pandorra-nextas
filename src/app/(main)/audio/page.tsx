"use client"
import { ElevenLabsClient } from "elevenlabs"
import {
  Building2,
  Car,
  Cat,
  Gamepad2,
  Megaphone,
  Mic2,
  Music,
  Settings2,
  Waves,
  Wind,
} from "lucide-react"
import React, { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import useSWR, { mutate } from "swr"

import { reduceCredit, verifyCredit } from "@/actions/credits.actions"
import { generateFX } from "@/actions/elevenlabs.actions"
import { translateToEnglish } from "@/actions/openai.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { InputNumber } from "@/components/input-number"
import { NothingYet } from "@/components/NothingYet"
import { Label } from "@/components/tremor/inputs/label"
import { Slider } from "@/components/tremor/inputs/slider"
import { Switch } from "@/components/tremor/inputs/switch"
import { Button } from "@/components/tremor/ui/button"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useShowZeroPayement } from "@/hooks/use-show-zero-payement"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { fetcher } from "@/lib/utils"
import { FX } from "@prisma/client"

import { AudioPlayer } from "./audio-player" // Assurez-vous du bon chemin d'importation

export default function Page() {
  const { t } = useTranslation()
  const { mutate: refreshUser } = useUser()
  const { data } = useSWR<FX[]>("/api/audio/generated-fx", fetcher)
  const [prompt, setPrompt] = useState("")
  const [durationSeconds, setDurationSeconds] = useState(8)
  const [isAuto, setIsAuto] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [influence, setInfluence] = useState(30)
  const charCount = prompt.length
  const { toast } = useToast()
  const maxChars = 9680

  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const { show } = useShowZeroPayement()
  const { user } = useUser()

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

  const handleGenerate = async () => {
    if (!prompt) return
    try {
      setIsLoading(true)
      const client = new ElevenLabsClient({
        apiKey: process.env.NEXT_PUBLIC_XI_API_KEY,
      })
      const correctedPrompt = await translateToEnglish(prompt)
      let option: any

      if (isAuto) {
        option = {
          text: correctedPrompt,
        }
        await handleToken(8)
      } else {
        option = {
          text: correctedPrompt,
          duration_seconds: durationSeconds,
          prompt_influence: influence / 100,
        }
        await handleToken(durationSeconds)
      }
      const response = await client.textToSoundEffects.convert(option)

      const chunks: Uint8Array[] = []
      for await (const chunk of response) {
        chunks.push(chunk)
      }

      const blob = new Blob(chunks as BlobPart[], { type: "audio/mpeg" })
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      await generateFX(prompt, url)
      mutate("/api/audio/generated-fx")
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
      onClick={() => setPrompt(t(text))}
    >
      <Icon className="mr-2 h-4 w-4" />
      {t(text)}
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
          placeholder={t(`Describe the sound you want...`)}
          id="tour9-step5"
        />
        <div className="flex w-full justify-between p-4">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" className="w-20" id="tour9-step6">
                <Settings2 size={28} />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="sm:max-w-lg">
              <DrawerHeader>
                <DrawerTitle>{t(`Settings`)}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <div className="w-full max-w-md space-y-8 p-4">
                  {/* Section Durée */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-lg font-medium">{t(`Duration`)}</h2>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          `Set the desired duration for your generation. Choose between 0.5 and 22 seconds.`,
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-length"
                        checked={isAuto}
                        onCheckedChange={setIsAuto}
                      />
                      <Label htmlFor="auto-length" className="text-sm">
                        {t(`Automatically choose the best duration`)}
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
                        {t(`Prompt Influence`)}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          `Adjust the slider so that your generation perfectly follows the prompt or leaves some room for creativity.`,
                        )}
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
                        <span>{t(`More Creative`)}</span>
                        <span>{t(`Follow Prompt`)}</span>
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
                  {t(`Reset`)}
                </Button>{" "}
                <DrawerClose asChild></DrawerClose>
                <DrawerClose asChild>
                  <Button
                    className="h-10 w-full sm:w-fit"
                    onClick={handleGenerate}
                    isLoading={isLoading}
                  >
                    {t(`Ok, got it!`)}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <Button
            className="text-md flex h-10 items-start p-2 px-4"
            onClick={handleGenerate}
            isLoading={isLoading}
            id="tour9-step7"
          >
            {t(`Generate Sound Effects`)}

            <span className="ml-1 flex items-center justify-center">
              {isAuto ? 8 : durationSeconds}{" "}
              <img src="/coin.png" className="ml-0.5 h-5 w-auto" />
            </span>
          </Button>
        </div>
      </MagicCard>

      {/* Affichage du player audio uniquement si une URL est disponible */}
      {audioUrl && (
        <MagicCard className="mt-4 flex items-center justify-center">
          <AudioPlayer audioUrl={audioUrl} />
        </MagicCard>
      )}
      <Alert className="mt-4 border border-border">
        <Megaphone className="h-4 w-4" />
        <AlertTitle>{t(`Announcement`)}!</AlertTitle>
        <AlertDescription>
          {t(
            `The audio files you generate will be deleted 24 hours after their creation. Please download your creations before this deadline to avoid losing your data.`,
          )}
        </AlertDescription>
      </Alert>
      <MagicCard className="mt-4 p-2">
        <div className="text-center text-muted-foreground">
          {t(`Or try out an example to get started!`)}
        </div>
        <div
          className="m-6 mt-4 flex flex-wrap justify-center gap-2"
          id="tour9-step8"
        >
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

      {!(data?.length === 0) ? (
        <MagicCard className="mt-4 p-4">
          {data?.map((audio) => (
            <div className="" key={audio.id} id="tour9-step4">
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
        <div className="" id="tour9-step4">
          <NothingYet
            className="mt-4"
            subtitle={t(`Your FX generation will be displayed here`)}
            title={t(`There is no FX yet`)}
          />
        </div>
      )}
    </div>
  )
}
