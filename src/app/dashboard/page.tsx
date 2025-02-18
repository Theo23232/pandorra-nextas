import StatsGraphs from "@/app/dashboard/components/HistoryChart"
import UserStat from "@/app/dashboard/components/UserStat"

export default async function RoutePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <UserStat />
      <StatsGraphs />
    </div>
  )
}
