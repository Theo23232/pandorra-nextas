import {Button} from "@/components/ui/button";
import {createConversationAction} from "@/actions/chat/conversation.actions";
import {Plus} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {startTransition} from "react";




interface NewConversationProps {
    mutateConversation: () => void
}

export function NewConversation({ mutateConversation }: NewConversationProps) {
    const { toast } = useToast()

    const handleNewConversationClick = () => {
        const promise = createConversationAction()

        startTransition(() => {
            promise
                .then(() => {
                    mutateConversation()
                    toast({ title: 'Conversation created', variant: 'success' })
                })
                .catch(() => {
                    toast({ title: 'Failed to create conversation', variant: 'error' })
                })
        })
    }

    return (
        <Button onClick={handleNewConversationClick} type="button" className="w-full">
            <Plus className="mr-2" /> Start Conversation
        </Button>
    )
}
