import { useEffect } from 'react';
import useSWR from 'swr';

import { fetcher } from '@/lib/utils';
import { User } from '@/types/next';

interface ErrorResponse {
  error: string
}

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<User | ErrorResponse>(
    "/api/auth/session",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
  useEffect(() => {
    if (data && "language" in data) {
      localStorage.setItem("lang", data.language)
    }
  }, [data])

  const isUnauthorized =
    data && "error" in data && data.error === "Non autorisé"
  const user = data && !isUnauthorized && !("error" in data) ? data : null

  return {
    user,
    isLoading,
    isError:
      !data || isUnauthorized || error ? new Error("User not found") : null,
    mutate,
  } as const
}
