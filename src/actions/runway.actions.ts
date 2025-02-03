"use server"
import RunwayML from "@runwayml/sdk"

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET, // Récupère la clé depuis l'env
})

export async function generateVideoFromImage(
  base64Image: string,
  promptText: string,
) {
  try {
    // Envoyer l’image à RunwayML
    const imageToVideo = await client.imageToVideo.create({
      model: "gen3a_turbo",
      promptImage: base64Image,
      promptText,
    })

    const taskId = imageToVideo.id

    // Vérifier l’état de la tâche jusqu’à sa fin
    let task
    do {
      await new Promise((resolve) => setTimeout(resolve, 10000))
      task = await client.tasks.retrieve(taskId)
    } while (!["SUCCEEDED", "FAILED"].includes(task.status))

    return task
  } catch (error) {
    console.error("RunwayML error:", error)
    throw new Error("Erreur lors de la génération de la vidéo.")
  }
}
