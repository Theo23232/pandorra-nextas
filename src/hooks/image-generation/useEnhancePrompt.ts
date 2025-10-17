"use client"
import { enhanceImagePrompt } from "@/actions/openai.actions"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

export function useEnhancePrompt() {
    const { toast } = useToast()
    const { mutate: mutateUser } = useUser()
    const { t } = useTranslation()
    const [isEnhancing, setIsEnhancing] = useState(false)

    const enhance = useCallback(async (prompt: string) => {
        setIsEnhancing(true)
        try {
            const promptEnhanced = await enhanceImagePrompt(prompt)
            mutateUser()
            return promptEnhanced
        } catch (error) {
            toast({
                title: t(`Error`),
                description: t(`Prompt enhancement failed`),
                variant: "error",
                duration: 3000,
            })
            return prompt
        } finally {
            setIsEnhancing(false)
        }
    }, [mutateUser, t, toast])

    return { enhance, isEnhancing }
}


