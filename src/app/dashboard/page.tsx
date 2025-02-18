import { NewUserStats } from "@/app/dashboard/components/NewUserStats"
import UserStat from "@/app/dashboard/components/UserStat"

export default async function RoutePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <UserStat />
      <NewUserStats />
    </div>
  )
}
