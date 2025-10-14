import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/utils"
import {ApiResponse} from "@/types/api-response";
import {MessageResponse} from "@/features/chat/types/messages";

export function useMessages(conversationId?: string) {
    const { data, error } = useSWR<ApiResponse<MessageResponse[]>>(
        `/api/conversations/${conversationId}`,
        fetcher
    )

    return {
        messages: data ?? {data: [] },
        isLoading: !data && !error,
        isError: error,
        reload: () => conversationId && mutate(`/api/conversations/${conversationId}`)
    }
}
