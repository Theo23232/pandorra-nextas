import { useState, useRef } from 'react'


export function useChatStream() {
    const [isStreaming, setIsStreaming] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)

    const streamMessage = async (
        conversationId: string,
        content: string,
        useWebSearch: boolean,
        onChunk: (content: string) => void
    ): Promise<void> => {
        setIsLoading(true)
        setIsStreaming(true)

        const controller = new AbortController()
        abortControllerRef.current = controller

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    conversationId,
                    content,
                    useWebSearch,
                }),
                signal: controller.signal,
                headers: {
                    Accept: 'text/event-stream',
                    'Cache-Control': 'no-cache',
                },
            })

            if (!response.body) throw new Error('No response body')

            const reader = response.body.getReader()
            let assistantContent = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = new TextDecoder().decode(value)
                assistantContent += chunk
                onChunk(assistantContent)
            }
        } finally {
            setIsLoading(false)
            setIsStreaming(false)
            abortControllerRef.current = null
        }
    }

    const stopStream = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current?.abort()
            setIsStreaming(false)
            setIsLoading(false)
        }
    }

    return {
        isStreaming,
        isLoading,
        streamMessage,
        stopStream,
    }
}
