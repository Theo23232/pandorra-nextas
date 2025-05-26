"use client"
import { notFound, useSearchParams } from "next/navigation"

import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { ImageToVideoForm } from "@/components/kling/image-to-video-form"
import { TextToVideoForm } from "@/components/kling/text-to-video-form"
import { VideoEffectsForm } from "@/components/kling/video-effects-form"
import { VideoGenerationsList } from "@/components/kling/video-generation-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page() {
  const searchParams = useSearchParams()
  const genType = searchParams?.get("genType")
  if (
    genType &&
    !["hug", "kiss", "heart_gesture", "squish", "expansion"].includes(genType)
  ) {
    return notFound()
  }
  return (
    <>
      <div className="flex gap-8">
        <MagicCard className="min-w-[32rem] max-w-lg p-4">
          <h1 className="mb-6 text-3xl font-bold">Video Generation</h1>

          <Tabs
            defaultValue={
              genType === "hug" ||
              genType === "kiss" ||
              genType === "heart_gesture" ||
              genType === "squish" ||
              genType === "expansion"
                ? "video-effects"
                : "image-to-video"
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="text-to-video"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Text to Video
              </TabsTrigger>
              <TabsTrigger
                value="image-to-video"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Image to Video
              </TabsTrigger>
              <TabsTrigger
                value="video-effects"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Video Effects
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text-to-video">
              <TextToVideoForm />
            </TabsContent>
            <TabsContent value="image-to-video">
              <ImageToVideoForm />
            </TabsContent>
            <TabsContent value="video-effects">
              <VideoEffectsForm
                genType={
                  genType as
                    | "hug"
                    | "kiss"
                    | "heart_gesture"
                    | "squish"
                    | "expansion"
                    | undefined
                }
              />
            </TabsContent>
          </Tabs>
        </MagicCard>
        <VideoGenerationsList />
      </div>
    </>
  )
}
