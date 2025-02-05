"use client"
import { X } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

import { generateVideoFromImage } from "@/actions/runway.actions"
import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleReset = () => {
    setImage(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (!image) return alert("Sélectionne une image")

    setLoading(true)

    // Lire l’image et la convertir en Base64
    const reader = new FileReader()
    reader.readAsDataURL(image)
    reader.onload = async () => {
      const base64Image = reader.result as string

      try {
        const data = await generateVideoFromImage(
          base64Image,
          "Generate a video from this image",
        )
        setResult(data)
      } catch (error) {
        alert("Erreur lors de la génération de la vidéo")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <MagicCard className="relative p-4">
        <div
          className="relative flex h-64 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
        >
          {preview ? (
            <>
              <Image
                src={preview || "/placeholder.svg"}
                alt="Preview"
                fill
                className="rounded-lg object-contain"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 z-10"
                onClick={(e) => {
                  e.stopPropagation()
                  handleReset()
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <p className="text-xl text-muted-foreground">
              Drag an image here, or click to select
            </p>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div className="mt-4 flex items-center justify-between">
          {image && (
            <div className="text-sm text-muted-foreground">
              {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
          <Button
            className="text-md ml-auto h-9"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Processing..." : "Generate Video"}
          </Button>
          <div className="mt-20">
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
          </div>
        </div>
      </MagicCard>
    </div>
  )
}
