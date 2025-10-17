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
                    'Content-Type': 'application/json', // Send JSON
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            if (!response.body) throw new Error('No response body')

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''
            let fullContent = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })

                const lines = buffer.split('\n\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)

                        if (data === '[DONE]') {
                            return
                        }

                        fullContent += data
                        onChunk(fullContent)
                    }
                }
            }
        } catch (error: any) {
            if (error === 'AbortError') {
                console.log('Stream aborted')
            } else {
                console.error('Streaming error:', error)
                throw error
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
