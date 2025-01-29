import RankingList from "@/app/(main)/ranking/content"
import { Card } from "@/components/tremor/ui/card"

export default function RankingsPage() {
  return (
    <Card className="mx-auto max-w-2xl">
      <RankingList />
    </Card>
  )
}
