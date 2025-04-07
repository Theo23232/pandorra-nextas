"use client"

import { useState } from "react"

import type { FileBrowserResponse } from "@/types/media"

export function useMediaUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const axios = (await import("axios")).default

      // Upload to the external file server
      const response = await axios.post(
        "https://fileservertemp.teratany.org/upload",
        formData,
        {
          headers: {
            // Add authentication headers if needed
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              )
              setUploadProgress(progress)
            }
          },
        },
      )

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = response.data as FileBrowserResponse

      // Just return the URL directly
      return data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    const results: string[] = []

    for (const file of files) {
      const result = await uploadFile(file)
      if (result) {
        results.push(result)
      }
    }

    return results
  }

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    uploadProgress,
    error,
  }
}
