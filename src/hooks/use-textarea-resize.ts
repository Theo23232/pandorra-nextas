import { useRef, useCallback } from 'react'

export function useTextareaResize() {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const handleResize = useCallback(() => {
        if (textareaRef.current) {
            if ("style" in textareaRef.current) {
                textareaRef.current.style.height = 'auto'
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
            }
        }
    }, [])

    return {
        textareaRef,
        handleResize,
    }
}
