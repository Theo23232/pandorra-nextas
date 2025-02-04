import { useCallback, useRef, useState } from "react"

interface UseAudioUploaderProps {
  onFileSelected: (file: File) => void
}

export const useAudioUploader = ({ onFileSelected }: UseAudioUploaderProps) => {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelected(e.dataTransfer.files[0])
      }
    },
    [onFileSelected],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        onFileSelected(e.target.files[0])
      }
    },
    [onFileSelected],
  )

  const triggerFileInput = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return {
    dragActive,
    handleDrag,
    handleDrop,
    handleChange,
    triggerFileInput,
    inputRef,
  }
}
