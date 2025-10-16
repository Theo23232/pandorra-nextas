import {fetcher} from "@/lib/utils";
import useSWR, { mutate } from "swr"
import {Conversation} from "@/features/chat/types/chat.types";

export function useConversations() {
    const { data, error } = useSWR<Conversation[]>("/api/conversations", fetcher);
    return {
        conversations: data ??  [],
        isLoading: data && !error,
        isError: error,
        reload: () => mutate("/api/conversations")
    }
}
