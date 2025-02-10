import { AlertCircle } from "lucide-react"

import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { Badge } from "@/components/tremor/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import type { Video } from "@prisma/client"

const SkeletonLoader = () => (
  <div className="flex animate-pulse space-x-4">
    <div className="h-64 w-full rounded-lg bg-gray-300"></div>
  </div>
)

interface VideoHistoryProps {
  histories: Video[] | undefined
}

export function VideoHistory({ histories }: VideoHistoryProps) {
  if (!histories) return null

  return (
    <MagicCard className="max-w-3xl p-4">
      <div className="flex h-fit flex-[2] flex-col overflow-hidden">
        <div className="h-full overflow-y-auto">
          {histories.map((video) => (
            <VideoHistoryItem key={video.id} video={video} />
          ))}
        </div>
      </div>
    </MagicCard>
  )
}

function VideoHistoryItem({ video }: { video: Video }) {
  switch (video.status) {
    case "Pending":
      return <PendingVideo video={video} />
    case "Failed":
      return <FailedVideo video={video} />
    case "Generated":
      return <GeneratedVideo video={video} />
    default:
      return null
  }
}

function PendingVideo({ video }: { video: Video }) {
  return (
    <div className="mb-6 space-y-4">
      <h3 className="text-xl font-medium">Pending</h3>
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        {video.url ? (
          <video src={video.url} controls className="h-auto w-full" />
        ) : (
          <SkeletonLoader />
        )}
        <VideoDetails video={video} />
      </div>
    </div>
  )
}

function FailedVideo({ video }: { video: Video }) {
  return (
    <div className="mb-6 space-y-4">
      <h3 className="text-xl font-medium">Failed</h3>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <VideoDetails video={video} />
          <p>
            <strong>Error:</strong>{" "}
            {video.failedMessage || "An unknown error occurred"}
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}

function GeneratedVideo({ video }: { video: Video }) {
  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="overflow-hidden rounded-lg border border-border shadow-sm">
          <video src={video.url} controls className="h-fit w-full" />
          <VideoDetails video={video} />
        </div>
      </div>
    </div>
  )
}

function VideoDetails({ video }: { video: Video }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="flex items-start gap-2">
        <span className="text-muted-foreground">Prompt:</span>
        <Badge className="overflow-hidden whitespace-pre-wrap break-words">
          {video.prompt}
        </Badge>
      </p>
      <p className="flex items-center gap-2">
        <span className="text-muted-foreground">Duration:</span>
        <Badge>{video.duration} secondes</Badge>
      </p>
      <p className="flex items-center gap-2">
        <span className="text-muted-foreground">Ratio:</span>
        <Badge>
          {video.ratio}{" "}
          {video.ratio === "1280:768" ? "(Landscape)" : "(Portrait)"}
        </Badge>
      </p>
      {video.status === "Generated" && (
        <p className="flex items-center gap-2">
          <span className="text-muted-foreground">Date:</span>
          <Badge>{new Date(video.createdAt).toLocaleString()}</Badge>
        </p>
      )}
      {video.status !== "Generated" && (
        <p className="flex items-center gap-2">
          <span className="text-muted-foreground">Status:</span>
          <Badge>{video.status}</Badge>
        </p>
      )}
    </div>
  )
}
