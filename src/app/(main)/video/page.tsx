import { getVideoGenerations } from "@/actions/kling.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { ImageToVideoForm } from "@/components/kling/image-to-video-form"
import { TextToVideoForm } from "@/components/kling/text-to-video-form"
import { VideoGenerationsList } from "@/components/kling/video-generation-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function Home() {
  const videoGenerations = await getVideoGenerations()

  return (
    <>
      <div className="flex gap-8">
        <MagicCard className="max-w-lg p-4">
          <h1 className="mb-6 text-3xl font-bold">Video Generation</h1>

          <Tabs defaultValue="image-to-video" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
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
            </TabsList>
            <TabsContent value="text-to-video">
              <TextToVideoForm />
            </TabsContent>
            <TabsContent value="image-to-video">
              <ImageToVideoForm />
            </TabsContent>
          </Tabs>
        </MagicCard>

        <div>
          <VideoGenerationsList initialGenerations={videoGenerations} />
        </div>
      </div>
    </>
  )
}
