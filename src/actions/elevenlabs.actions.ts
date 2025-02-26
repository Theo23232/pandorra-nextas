"use server"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

import { SA } from "@/lib/safe-ation"
import { prisma } from "@/prisma"

export const generateFX = SA(
  async (user, prompt: string, blob: Blob): Promise<any> => {
    await prisma.fX.create({
      data: {
        userId: user.id,
        prompt,
        url: await downloadAudio(blob),
      },
    })
  },
)

export const generateTTS = SA(
  async (
    user,
    prompt: string,
    blob: Blob,
    lang: string,
    voice: string,
  ): Promise<any> => {
    await prisma.tTS.create({
      data: {
        userId: user.id,
        prompt,
        url: await downloadAudio(blob),
        lang,
        voice,
      },
    })
  },
)

export const generateVoiceChange = SA(
  async (user, blob: Blob, voice: string): Promise<any> => {
    await prisma.voiceChange.create({
      data: {
        userId: user.id,
        url: await downloadAudio(blob),
        voice,
      },
    })
  },
)

export const downloadAudio = async (blob: Blob): Promise<string> => {
  try {
    // Convertir le Blob en Buffer
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Générer un nom de fichier unique avec uuid
    const fileName = `audio-${uuidv4()}.mp3`

    // Chemin où enregistrer le fichier (dans le dossier public)
    const filePath = path.join(process.cwd(), "public", fileName)

    // Écrire le fichier sur le disque
    await writeFile(filePath, buffer)

    // Retourner le nom du fichier (sans le chemin complet)

    const url = await downloadVideo(fileName)
    return url
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du fichier audio:", error)
    throw new Error("Échec de l'enregistrement du fichier audio")
  }
}

export const downloadVideo = async (audioUrl: string) => {
  const API_BASE_URL = "https://pdr.teratany.org"
  try {
    const response = await fetch(`${API_BASE_URL}/videos/download-from-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoUrl: audioUrl }),
    })

    if (!response.ok) {
      throw new Error("Erreur lors du téléchargement")
    }
    const data = await response.json()
    return `${API_BASE_URL}/${data.videoUrl}`
  } catch (err) {
    console.error(`Erreur: ${(err as Error).message}`)
    throw new Error(
      `Erreur lors du téléchargement de la vidéo: ${(err as Error).message}`,
    )
  }
}
