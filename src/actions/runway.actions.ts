"use server"
import fetch from "node-fetch" // Add this line to import fetch

import { reduceCredit } from "@/actions/credits.actions"
import { currentUser } from "@/lib/current-user"
import { SA } from "@/lib/safe-ation"
import { prisma } from "@/prisma"
import { Video } from "@prisma/client"
import RunwayML from "@runwayml/sdk"

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET, // Récupère la clé depuis l'env
})

export async function generateVideoFromImage(
  base64Image: string,
  promptText: string,
  duration: 5 | 10,
  ratio: "768:1280" | "1280:768",
) {
  try {
    const user = await currentUser()
    // Envoyer l’image à RunwayML
    const imageToVideo = await client.imageToVideo.create({
      model: "gen3a_turbo",
      promptImage:
        base64Image === "https://test.pandorra.ai/assets/fond.png"
          ? [
              {
                uri: base64Image,
                position: "last",
              },
            ]
          : base64Image,
      promptText,
      duration: duration,
      ratio: ratio,
    })

    const taskId = imageToVideo.id

    if (!user) {
      throw new Error("Not authentified")
    }

    // Vérifier l’état de la tâche jusqu’à sa fin
    await prisma.video.create({
      data: {
        userId: user.id,
        prompt: promptText,
        duration: duration,
        status: "Pending",
        url: "",
        isImage: base64Image ? true : false,
        taskId: taskId,
        ratio: ratio,
        failedMessage: "",
      },
    })

    return null
  } catch (error) {
    console.error("RunwayML error:", error)
    throw new Error("Erreur lors de la génération de la vidéo.")
  }
}

export const downloadVideo = async (videoUrl: string) => {
  const API_BASE_URL = "https://pdr.teratany.org"
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

    return data
  } catch (err) {
    console.error(`Erreur: ${(err as Error).message}`)
    throw new Error(
      `Erreur lors du téléchargement de la vidéo: ${(err as Error).message}`,
    )
  }
}

export const videoVerifyTask = SA(
  async (user, taskId: string): Promise<Video> => {
    const API_BASE_URL = "https://pdr.teratany.org"

    let video: Video
    let task = await client.tasks.retrieve(taskId)
    if (task.status === "SUCCEEDED") {
      try {
        const downloadData = await downloadVideo(task.output![0])

        video = await prisma.video.update({
          where: {
            taskId: taskId,
          },
          data: {
            status: "Generated",
            url: `${API_BASE_URL}/${downloadData.videoUrl}`,
          },
        })
        const duration = video.duration
        await reduceCredit(duration == 5 ? 40 : 80)
      } catch (downloadError) {
        console.error(
          "Erreur lors du téléchargement de la vidéo:",
          downloadError,
        )
        throw new Error("Erreur lors du téléchargement de la vidéo")
      }
    } else if (task.status === "FAILED") {
      video = await prisma.video.update({
        where: {
          taskId: taskId,
        },
        data: {
          status: "Failed",
          failedMessage: task.failure || "Unknown error",
        },
      })
    }
    video = await prisma.video.update({
      where: {
        taskId: taskId,
      },
      data: {
        failedMessage: "",
      },
    })
    return video
  },
)
