"use server"
import { currentUser } from '@/lib/current-user';
import { SA } from '@/lib/safe-ation';
import { prisma } from '@/prisma';
import { Video } from '@prisma/client';
import RunwayML from '@runwayml/sdk';

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET, // Récupère la clé depuis l'env
})

export async function generateVideoFromImage(
  base64Image: string,
  promptText: string,
  duration: 5 | 10,
) {
  try {
    const user = await currentUser()
    // Envoyer l’image à RunwayML
    const imageToVideo = await client.imageToVideo.create({
      model: "gen3a_turbo",
      promptImage:
        base64Image === "https://pandorra.ai/assets/fond.png"
          ? [
              {
                uri: base64Image,
                position: "last",
              },
            ]
          : base64Image,
      promptText,
      duration: duration,
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
        duration: 5,
        status: "Pending",
        url: "",
        isImage: base64Image ? true : false,
        taskId: taskId,
      },
    })

    return null
  } catch (error) {
    console.error("RunwayML error:", error)
    throw new Error("Erreur lors de la génération de la vidéo.")
  }
}

export const videoVerifyTask = SA(
  async (user, taskId: string): Promise<Video> => {
    let video
    let task = await client.tasks.retrieve(taskId)
    if (task.status === "SUCCEEDED") {
      video = await prisma.video.update({
        where: {
          taskId: taskId,
        },
        data: {
          status: "Generated",
          url: task.output![0],
        },
      })
    } else if (task.status === "FAILED") {
      video = await prisma.video.update({
        where: {
          taskId: taskId,
        },
        data: {
          status: "Failed",
        },
      })
    }
    console.log("task. ==> ", task.failure)

    return video
  },
)
