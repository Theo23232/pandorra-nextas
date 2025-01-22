import useSWR from "swr"

import { fetcher } from "@/lib/utils"
import { User } from "@/types/next"

export function useUser() {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR<User>("/api/auth/session", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return {
    user: user,
    isLoading,
    isError: !user || error ? new Error("User not found") : null,
    mutate,
  } as const
}
