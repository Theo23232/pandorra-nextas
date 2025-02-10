import { redirect } from "next/navigation"

import { currentUser } from "@/lib/current-user"

export default async function RoutePage() {
  const user = await currentUser()
  if (user) return redirect(`/profile/${user.id}`)
  else return redirect("/")
}
