import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";






export function NewConversation() {

     const router = useRouter();
    const handleNewConversationClick = () => {
       router.push('/chat')
    }

    return (
        <Button onClick={handleNewConversationClick} type="button" className="w-full">
            <Plus className="mr-2" /> Start Conversation
        </Button>
    )
}
