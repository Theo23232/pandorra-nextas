"use client"
import { useState } from "react"

const API_BASE_URL = "https://pandorra.ai"

export const VideoDownloader = () => {
  const [videoUrl, setVideoUrl] = useState("")
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("Téléchargement en cours...")
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/videos/download-from-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement")
      }

      const data = await response.json()
      setStatus(
        `Vidéo téléchargée avec succès ! Nom du fichier: ${data.filename}`,
      )
      setVideoUrl("")

      // Vous pouvez accéder à la vidéo via data.videoUrl
      console.log("URL de la vidéo:", `${API_BASE_URL}${data.videoUrl}`)
    } catch (err) {
      setError(`Erreur: ${(err as Error).message}`)
      setStatus("")
    }
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="videoUrl" className="mb-2 block text-sm font-medium">
            URL de la vidéo
          </label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="https://example.com/video.mp4"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Télécharger la vidéo
        </button>
      </form>

      {status && <p className="mt-4 text-green-600">{status}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  )
}

export default VideoDownloader
