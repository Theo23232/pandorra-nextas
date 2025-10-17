"use client"
import { fetcher } from "@/lib/utils"
import useSWRInfinite from "swr/infinite"

const PAGE_SIZE = 8

export function useInfiniteGenerations() {
    const getKey = (pageIndex: number, previousPageData: any[] | null) => {
        if (previousPageData && !previousPageData.length) return null
        return `/api/generation?page=${pageIndex}&limit=${PAGE_SIZE}`
    }

    const { data, error, size, setSize, mutate, isValidating } = useSWRInfinite<
        any[]
    >(getKey, fetcher, {
        revalidateOnFocus: false,
        revalidateFirstPage: false,
    })

    const pages = data ? data.flat() : []
    const isLoadingMore =
        isValidating || (size > 0 && data && typeof data[size - 1] === "undefined")
    const isEmpty = data?.[0]?.length === 0
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)

    return { pages, error, size, setSize, mutate, isValidating, isLoadingMore, isEmpty, isReachingEnd }
}


