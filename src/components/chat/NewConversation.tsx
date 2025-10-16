import {Button} from "@/components/ui/button";
import {createConversationAction} from "@/actions/chat/conversation.actions";
import {Plus} from "lucide-react";

export function NewConversation() {
    return (
        <Button onClick={createConversationAction} type="submit" className="w-full">
            <Plus className="mr-2" /> Start Conversation
        </Button>
    )
}
