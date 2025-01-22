import { Gem } from "lucide-react"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { fetcher } from "@/lib/utils"
import { User } from "@prisma/client"

export default function JetonCounter() {
  const { data: user } = useSWR<User>("/api/user/current", fetcher)

  return (
    <Button
      variant="outline"
      className="flex h-10 items-center justify-center gap-3"
      size="sm"
    >
      <div className="flex h-full items-center gap-2">
        <Gem size={18} color="orange" />
        <p>{user?.jeton}</p>
      </div>
      <Separator orientation="vertical" className="h-5" />
      <p className="text-md">Purchase</p>
    </Button>
  )
}
