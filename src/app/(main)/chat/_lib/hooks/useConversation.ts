import useSWR, { mutate } from "swr"
import { fetcher } from "@/lib/utils"
import {Conversation} from "@/features/chat/types/conversation";
import {ApiResponse} from "@/types/api-response";

export function useConversations() {
    const { data, error } = useSWR<ApiResponse<Conversation[]>>("/api/conversations", fetcher);
    return {
        conversations: data ?? {data: []},
        isLoading: data && !error,
        isError: error,
        reload: () => mutate("/api/conversations")
    }
}

