import { NewUserStats } from "@/app/dashboard/components/NewUserStats"
import { Usage } from "@/app/dashboard/components/Usage"
import UserStat from "@/app/dashboard/components/UserStat"

export default async function RoutePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <UserStat />
      <Usage />
      <NewUserStats />
    </div>
  )
}
