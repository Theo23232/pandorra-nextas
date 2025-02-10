/* eslint-disable @next/next/no-img-element */
import { Upload, X } from "lucide-react"

import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import type React from "react"
interface VideoGeneratorFormProps {
  previewUrl: string | null
  handleRemoveImage: () => void
  duration: string
  setDuration: (value: string) => void
  ratio: string
  setRatio: (value: string) => void
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  promptText: string
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  handleSubmit: () => void
  loading: boolean
}

export function VideoGeneratorForm({
  previewUrl,
  handleRemoveImage,
  duration,
  setDuration,
  ratio,
  setRatio,
  handleImageUpload,
  fileInputRef,
  promptText,
  handleInput,
  textareaRef,
  handleSubmit,
  loading,
}: VideoGeneratorFormProps) {
  return (
    <MagicCard className="max-w-3xl">
      <Textarea
        ref={textareaRef}
        value={promptText}
        onChange={handleInput}
        className="w-full resize-none overflow-hidden border-0 pt-4 text-xl shadow-none focus-visible:ring-0"
        placeholder="Describe the video you want..."
      />
      <div className="flex justify-between p-4">
        <div className="flex w-full flex-col gap-4 p-4">
          {previewUrl && (
            <div className="relative">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Uploaded image preview"
                className="max-h-64 w-full object-contain"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-5 right-36 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 s</SelectItem>
                  <SelectItem value="10">10 s</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratio} onValueChange={setRatio}>
                <SelectTrigger className="w-[125px]">
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1280:768">Landscape</SelectItem>
                  <SelectItem value="768:1280">Portrait</SelectItem>
                </SelectContent>
              </Select>
              <Label
                htmlFor="image-upload"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-1.5 transition-colors hover:bg-gray-50"
              >
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {previewUrl ? "Change image" : "Upload image"}
                </span>
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                ref={fileInputRef}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="text-md h-10 w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Generate Video"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MagicCard>
  )
}
