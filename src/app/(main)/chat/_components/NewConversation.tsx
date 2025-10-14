"use client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {createConversationAction} from "@/app/(main)/chat/_lib/actions/create-conversation.action";

export function NewConversation() {
    return (
            <Button onClick={createConversationAction} type="submit" className="w-full">
                <Plus className="mr-2" /> Start Conversation
            </Button>
    )
}

