"use server"

import axios from 'axios';
import fs from 'fs';
import path from 'path';

import { reduceCredit } from '@/actions/credits.actions';
import { myCache } from '@/cache';
import { currentUser } from '@/lib/current-user';
import { prisma } from '@/prisma';
import { pusherServer } from '@/pusher';
import { GenerationWithImages } from '@/types/pandorra';
import { GeneratedImage } from '@prisma/client';

interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "DELETE"
  data?: any
  headers?: Record<string, string>
}

export type LeoFetchGenerationResult = {
  generations_by_pk: GenerationWithImages
}

type UnzoomJob = {
  sdUnzoomJob: {
    id: string
    apiCreditCost: number
  }
}
type RemoveBgJob = {
  sdNobgJob: {
    id: string
    apiCreditCost: number
  }
}
type UpscaleJob = {
  sdUpscaleJob: {
    id: string
    apiCreditCost: number
  }
}

type GeneratedImageVariation = {
  generated_image_variation_generic: {
    url: string
    status: string
    id: string
    createdAt: string
    transformType: string
  }[]
}

const API_KEY = process.env.LEONARDO_API_KEY
export async function uploadImage(imageFilePath: string): Promise<string> {
  const user = await currentUser()
  if (!user) throw new Error("You are not authenticated")

  const extension = path.extname(imageFilePath).toLowerCase().replace(".", "")
  const allowedExtensions = ["png", "jpg", "jpeg", "webp"]
  if (!allowedExtensions.includes(extension)) {
    throw new Error(
      `Unsupported file extension: ${extension}. Allowed extensions are: ${allowedExtensions.join(", ")}`,
    )
  }

  const response = await axios
    .post(
      `${process.env.FILE_API_PYTHON}/upload_image`,
      { extension: extension, filename: imageFilePath.split("\\").pop() },
      { headers: { "Content-Type": "application/json" } },
    )
    .catch((error) => {
      {
        if (axios.isAxiosError(error)) {
          console.error("Error message:", error.message)
          console.error("Error response:", error.response?.data)
        } else {
          console.error("Unexpected error:", error)
        }
      }
    })

  if (response) {
    const imageId = response.data.image_id
    const url = `https://cloud.leonardo.ai/api/rest/v1/init-image/${imageId}`
    const headers = {
      accept: "application/json",
      authorization: `Bearer ${API_KEY}`,
    }
    const imageData = await fetch(url, {
      method: "GET",
      headers: headers,
    })
    const data = await imageData.json()

    if (!imageData.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    await prisma.userImage.create({
      data: {
        userId: user.id,
        imageId: data.init_images_by_pk.id,
        imageUrl: data.init_images_by_pk.url,
        isAIGenerated: false,
      },
    })
    return imageId // Retournez l'identifiant de l'image
  } else throw new Error("Unexpected error")
}

export async function leofetch<T>(
  url: string,
  options: FetchOptions,
): Promise<T> {
  const defaultHeaders = {
    accept: "application/json",
    authorization: `Bearer ${API_KEY}`,
    "content-type": "application/json",
  }

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  }

  const config: RequestInit = {
    method: options.method,
    headers: headers,
    body: options.data ? JSON.stringify(options.data) : undefined,
  }

  try {
    const response: any = await fetch(url, config)
    return (await response.json()) as T
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  }
}

export async function fetchGenerationResult(
  id: string,
): Promise<GenerationWithImages> {
  const user = await currentUser()
  if (!user) throw new Error("You are not authenticated")

  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const timeout = 30_000 // Timeout après 30s (ajustable)

    const interval = setInterval(async () => {
      console.log("Refreshing...")
      try {
        if (Date.now() - startTime > timeout) {
          clearInterval(interval)
          reject(new Error("Timeout: La génération a pris trop de temps."))
          return
        }

        const result = await leofetch<LeoFetchGenerationResult>(
          `https://cloud.leonardo.ai/api/rest/v1/generations/${id}`,
          { method: "GET" },
        )

        if (result && result.generations_by_pk) {
          const response = result.generations_by_pk as GenerationWithImages

          if (response.generated_images.length) {
            console.log("Generated")

            const data = await prisma.generation.create({
              data: {
                id: response.id,
                modelId: response.modelId,
                motion: response.motion,
                motionModel: response.motionModel,
                motionStrength: response.motionStrength,
                prompt: response.prompt,
                negativePrompt: response.negativePrompt,
                imageHeight: response.imageHeight,
                imageToVideo: response.imageToVideo,
                imageWidth: response.imageWidth,
                inferenceSteps: response.inferenceSteps,
                ultra: response.ultra,
                public: response.public,
                scheduler: response.scheduler,
                sdVersion: response.sdVersion,
                status: response.status,
                presetStyle: response.presetStyle,
                guidanceScale: response.guidanceScale,
                promptMagic: response.promptMagic,
                promptMagicVersion: response.promptMagicVersion,
                promptMagicStrength: response.promptMagicStrength,
                photoReal: response.photoReal,
                photoRealStrength: response.photoRealStrength,
                fantasyAvatar: response.fantasyAvatar,
                user: { connect: { id: user.id } },
                generated_images: {
                  create: response.generated_images.map((image) => ({
                    id: image.id,
                    url: image.url,
                    nsfw: image.nsfw,
                    motionMP4URL: image.motionMP4URL,
                  })),
                },
              },
            })
            const cacheKey = `user:generation:${user.id}`
            myCache.del(cacheKey)
            await Promise.all(
              response.generated_images.map((image) =>
                prisma.userImage.create({
                  data: {
                    userId: user.id,
                    imageId: image.id,
                    imageUrl: image.url,
                    isAIGenerated: true,
                  },
                }),
              ),
            )

            clearInterval(interval)
            resolve(response)
          }
        } else {
          console.log(result)

          throw new Error("error")
        }
      } catch (error) {
        clearInterval(interval)
        console.error("Generation error:", error)
        reject(error)
      }
    }, 2000)
  })
}

export const generationInsert = async (
  result: LeoFetchGenerationResult,
): Promise<GenerationWithImages> => {
  const user = await currentUser()
  if (!user) throw new Error("You are not authenticated")
  if (result && result.generations_by_pk) {
    const response = result.generations_by_pk as GenerationWithImages

    if (response.generated_images.length) {
      await reduceCredit(response.generated_images.length * 5)
      await prisma.generation.create({
        data: {
          id: response.id,
          modelId: response.modelId,
          motion: response.motion,
          motionModel: response.motionModel,
          motionStrength: response.motionStrength,
          prompt: response.prompt,
          negativePrompt: response.negativePrompt,
          imageHeight: response.imageHeight,
          imageToVideo: response.imageToVideo,
          imageWidth: response.imageWidth,
          inferenceSteps: response.inferenceSteps,
          ultra: response.ultra,
          public: response.public,
          scheduler: response.scheduler,
          sdVersion: response.sdVersion,
          status: response.status,
          presetStyle: response.presetStyle,
          guidanceScale: response.guidanceScale,
          promptMagic: response.promptMagic,
          promptMagicVersion: response.promptMagicVersion,
          promptMagicStrength: response.promptMagicStrength,
          photoReal: response.photoReal,
          photoRealStrength: response.photoRealStrength,
          fantasyAvatar: response.fantasyAvatar,
          // Associer l'utilisateur avec la relation connect
          user: { connect: { id: user.id } },
          generated_images: {
            create: response.generated_images.map((image) => ({
              id: image.id,
              url: image.url,
              nsfw: image.nsfw,
              motionMP4URL: image.motionMP4URL,
            })),
          },
        },
      })
      const cacheKey = `user:generation:${user.id}`
      myCache.del(cacheKey)
      response.generated_images.map((image) => ({
        url: image.url,
        nsfw: image.nsfw,
        motionMP4URL: image.motionMP4URL,
      })),
        response.generated_images.forEach(async (image) => {
          await prisma.userImage.create({
            data: {
              userId: user.id,
              imageId: image.id,
              imageUrl: image.url,
              isAIGenerated: true,
            },
          })
        })
    }
  }

  return result.generations_by_pk
}

export async function saveImage(
  base64Image: string,
  fileName: string,
): Promise<string> {
  fileName =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    path.extname(fileName)
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "")
  const buffer = Buffer.from(base64Data, "base64") as Uint8Array
  const filePath = path.join(process.cwd(), "public/uploads", fileName)
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
  }
  await fs.promises.writeFile(filePath, buffer)
  return filePath
}

export async function unzoom(
  imageUrl: string,
): Promise<GeneratedImageVariation> {
  const image = await prisma.userImage.findFirst({ where: { imageUrl } })
  if (!image) throw new Error("Image not found")
  const data = {
    id: image.imageId,
    isVariation: image.isVariant,
  }
  const response = await leofetch<UnzoomJob>(
    `https://cloud.leonardo.ai/api/rest/v1/variations/unzoom`,
    { method: "POST", data },
  )
  const unzoomId = response?.sdUnzoomJob.id
  if (!unzoomId) throw new Error("Unzoom job ID not found")
  return await pollUntilComplete(unzoomId, image.id)
}

export async function removeBg(
  imageUrl: string,
): Promise<GeneratedImageVariation> {
  const image = await prisma.userImage.findFirst({ where: { imageUrl } })
  if (!image) throw new Error("Image not found")
  const data = {
    id: image.imageId,
    isVariation: image.isVariant,
  }
  const response = await leofetch<RemoveBgJob>(
    `https://cloud.leonardo.ai/api/rest/v1/variations/nobg`,
    { method: "POST", data },
  )
  const unzoomId = response?.sdNobgJob.id
  if (!unzoomId) throw new Error("Unzoom job ID not found")
  return await pollUntilComplete(unzoomId, image.id)
}

export async function upscale(
  imageUrl: string,
): Promise<GeneratedImageVariation> {
  const image = await prisma.userImage.findFirst({ where: { imageUrl } })
  if (!image) throw new Error("Image not found")
  const data = {
    id: image.imageId,
  }

  const response = await leofetch<UpscaleJob>(
    `https://cloud.leonardo.ai/api/rest/v1/variations/upscale`,
    { method: "POST", data },
  )
  const unzoomId = response?.sdUpscaleJob.id
  if (!unzoomId) throw new Error("Unzoom job ID not found")
  return await pollUntilComplete(unzoomId, image.id)
}

async function pollUntilComplete(
  unzoomId: string,
  originalId: string,
): Promise<GeneratedImageVariation> {
  const user = await currentUser()
  if (!user) throw new Error("You are not connected")
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const res = await leofetch<GeneratedImageVariation>(
          `https://cloud.leonardo.ai/api/rest/v1/variations/${unzoomId}`,
          { method: "GET" },
        )
        if (res.generated_image_variation_generic[0].status === "COMPLETE") {
          await prisma.userImage.create({
            data: {
              id: res.generated_image_variation_generic[0].id,
              imageId: res.generated_image_variation_generic[0].id,
              imageUrl: res.generated_image_variation_generic[0].url,
              userId: user.id,
              isAIGenerated: true,
              isVariant: true,
            },
          })

          const variant = await prisma.variant.create({
            data: {
              userId: user.id,
              originalId: originalId,
              variantId: res.generated_image_variation_generic[0].id,
              transformType:
                res.generated_image_variation_generic[0].transformType,
            },
          })
          clearInterval(interval)
          resolve(res)
        }
      } catch (error) {
        clearInterval(interval)
        reject(error)
      }
    }, 2000)
  })
}

export async function leonardoGenerateImage<T>(options: FetchOptions) {
  console.log("🚀 Démarrage de la génération d'image Leonardo")

  try {
    // Vérification de l'authentification
    const user = await currentUser()
    if (!user) {
      console.error("❌ Échec d'authentification: Utilisateur non connecté")
      throw new Error("Vous n'êtes pas authentifié")
    }
    console.log(`✅ Utilisateur authentifié: ${user.id}`)

    let generationId = ""
    const defaultHeaders = {
      accept: "application/json",
      authorization: `Bearer ${API_KEY}`,
      "content-type": "application/json",
    }

    const headers = {
      ...defaultHeaders,
      ...options.headers,
    }

    const num_image = options.data.num_images
    console.log(`📊 Nombre d'images demandées: ${num_image}`)

    // Configuration pour une seule image à la fois
    options.data.num_images = 1

    const idList: string[] = []
    const allGeneratedImages: GeneratedImage[] = [] // Liste pour stocker toutes les images

    const config: RequestInit = {
      method: options.method,
      headers: headers,
      body: options.data ? JSON.stringify(options.data) : undefined,
    }

    // Étape 1: Génération des IDs
    console.log("🔄 Étape 1: Lancement des requêtes de génération")
    for (let i = 1; i <= num_image; i++) {
      try {
        console.log(`📤 Requête de génération ${i}/${num_image}`)
        const response: any = await fetch(
          "https://cloud.leonardo.ai/api/rest/v1/generations",
          config,
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error(
            `❌ Échec de la requête ${i}: Status ${response.status}`,
            errorData,
          )
          throw new Error(
            `Échec de la requête de génération ${i}: ${response.statusText}`,
          )
        }

        const data = await response.json()
        if (!data?.sdGenerationJob?.generationId) {
          console.error(
            `❌ Données de réponse invalides pour la requête ${i}:`,
            data,
          )
          throw new Error(
            "Format de réponse invalide: generationId introuvable",
          )
        }

        idList.push(data.sdGenerationJob.generationId)
        console.log(
          `✅ Génération ${i} initiée avec ID: ${data.sdGenerationJob.generationId}`,
        )
      } catch (error) {
        console.error(`❌ Erreur lors de la génération ${i}:`, error)
        throw new Error(
          `Échec lors de l'initialisation de la génération d'image ${i}: ${"Erreur inconnue"}`,
        )
      }
    }

    console.log(`📋 Étape 1 terminée: ${idList.length} générations initiées`)

    // Étape 2: Récupération des images générées
    console.log("🔄 Étape 2: Récupération des images générées")
    for (let i = 0; i < idList.length; i++) {
      console.log(
        `🔍 Surveillance de la génération ${i + 1}/${idList.length} (ID: ${idList[i]})`,
      )

      try {
        await new Promise((resolve, reject) => {
          const startTime = Date.now()
          const timeout = 60_000
          let attempts = 0
          // Pour stocker localement cette image spécifique
          let currentImageData: GeneratedImage | null = null

          const interval = setInterval(async () => {
            attempts++
            console.log(
              `🔄 Tentative ${attempts} pour la génération ${i + 1} (ID: ${idList[i]})`,
            )

            try {
              if (Date.now() - startTime > timeout) {
                clearInterval(interval)
                console.error(
                  `⏱️ Timeout pour la génération ${i + 1} après ${attempts} tentatives`,
                )
                reject(
                  new Error(
                    `Timeout: La génération ${i + 1} a pris trop de temps (> ${timeout / 1000}s)`,
                  ),
                )
                return
              }

              const result = await leofetch<LeoFetchGenerationResult>(
                `https://cloud.leonardo.ai/api/rest/v1/generations/${idList[i]}`,
                { method: "GET" },
              )

              if (!result) {
                console.error(`❌ Résultat vide pour la génération ${i + 1}`)
                throw new Error("Résultat de génération vide")
              }

              if (!result.generations_by_pk) {
                console.error(
                  `❌ Données generations_by_pk manquantes pour la génération ${i + 1}:`,
                  result,
                )
                throw new Error(
                  "Format de réponse invalide: generations_by_pk introuvable",
                )
              }

              const response = result.generations_by_pk as GenerationWithImages

              if (
                response.generated_images &&
                response.generated_images.length
              ) {
                console.log(
                  `✅ Images générées pour ${i + 1} (ID: ${idList[i]})`,
                )
                const res: GeneratedImage[] =
                  response.generated_images as GeneratedImage[]

                // Stocker l'image actuelle
                currentImageData = {
                  id: res[0].id,
                  url: res[0].url,
                  nsfw: res[0].nsfw,
                  motionMP4URL: res[0].motionMP4URL,
                  generationId: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }

                // L'ajouter à la liste globale
                allGeneratedImages.push(currentImageData)

                // Étape 3: Sauvegarde en base de données (seulement pour la première génération)
                if (i === 0) {
                  console.log(
                    `💾 Sauvegarde des métadonnées de génération (ID: ${response.id})`,
                  )
                  generationId = response.id
                  try {
                    await prisma.generation.create({
                      data: {
                        id: response.id,
                        modelId: response.modelId,
                        motion: response.motion,
                        motionModel: response.motionModel,
                        motionStrength: response.motionStrength,
                        prompt: response.prompt,
                        negativePrompt: response.negativePrompt,
                        imageHeight: response.imageHeight,
                        imageToVideo: response.imageToVideo,
                        imageWidth: response.imageWidth,
                        inferenceSteps: response.inferenceSteps,
                        ultra: response.ultra,
                        public: response.public,
                        scheduler: response.scheduler,
                        sdVersion: response.sdVersion,
                        status: response.status,
                        presetStyle: response.presetStyle,
                        guidanceScale: response.guidanceScale,
                        promptMagic: response.promptMagic,
                        promptMagicVersion: response.promptMagicVersion,
                        promptMagicStrength: response.promptMagicStrength,
                        photoReal: response.photoReal,
                        photoRealStrength: response.photoRealStrength,
                        fantasyAvatar: response.fantasyAvatar,
                        user: { connect: { id: user.id } },
                      },
                    })
                    const cacheKey = `user:generation:${user.id}`
                    myCache.del(cacheKey)
                    console.log(`✅ Métadonnées de génération sauvegardées`)
                  } catch (error) {
                    console.error(
                      `❌ Erreur lors de la sauvegarde des métadonnées:`,
                      error,
                    )
                    throw new Error(
                      `Échec de la sauvegarde en base de données: ${"Erreur inconnue"}`,
                    )
                  }
                }

                // Étape 4: Sauvegarde de l'image générée actuelle
                console.log(`💾 Sauvegarde de l'image générée ${i + 1}`)
                try {
                  // Ne sauvegarder que l'image actuelle, pas toute la liste
                  await prisma.generatedImage.create({
                    data: {
                      generationId: generationId,
                      id: currentImageData.id,
                      url: currentImageData.url,
                      nsfw: currentImageData.nsfw,
                      motionMP4URL: currentImageData.motionMP4URL,
                    },
                  })
                  console.log(`✅ Image générée ${i + 1} sauvegardée`)
                } catch (error) {
                  console.error(
                    `❌ Erreur lors de la sauvegarde de l'image générée ${i + 1}:`,
                    error,
                  )
                  throw new Error(
                    `Échec de la sauvegarde de l'image: ${"Erreur inconnue"}`,
                  )
                }

                // Étape 5: Association de l'image actuelle à l'utilisateur
                console.log(
                  `🔗 Association de l'image ${i + 1} à l'utilisateur ${user.id}`,
                )
                try {
                  await prisma.userImage.create({
                    data: {
                      userId: user.id,
                      imageId: currentImageData.id,
                      imageUrl: currentImageData.url,
                      isAIGenerated: true,
                    },
                  })
                  console.log(`✅ Image ${i + 1} associée à l'utilisateur`)
                } catch (error) {
                  console.error(
                    `❌ Erreur lors de l'association de l'image à l'utilisateur:`,
                    error,
                  )
                  throw new Error(
                    `Échec de l'association de l'image: ${"Erreur inconnue"}`,
                  )
                }

                clearInterval(interval)
                resolve(true)
              } else {
                console.log(
                  `⏳ Génération ${i + 1} en cours, pas encore d'images (tentative ${attempts})`,
                )
              }
            } catch (error) {
              console.error(
                `❌ Erreur pendant la surveillance de la génération ${i + 1} (tentative ${attempts}):`,
                error,
              )

              // On ne rejette pas immédiatement pour permettre de réessayer
              if (attempts >= 20) {
                // Limite de tentatives (environ 40 secondes)
                clearInterval(interval)
                reject(
                  new Error(
                    `Échec après ${attempts} tentatives: ${"Erreur inconnue"}`,
                  ),
                )
              }
            }
          }, 2000)
        })
      } catch (error) {
        console.error(`❌ Échec final pour la génération ${i + 1}:`, error)
        throw new Error(
          `Échec de la génération d'image ${i + 1}: ${"Erreur inconnue"}`,
        )
      }
    }

    console.log(
      `🎉 Génération terminée avec succès: ${allGeneratedImages.length} images`,
    )
    await pusherServer.trigger(`private-user-${user.id}`, "new-message", {
      message: "Image generation finished!",
      status: "success",
      timestamp: new Date().toISOString(),
    })
    return allGeneratedImages
  } catch (error) {
    console.error("❌ Erreur fatale dans leonardoGenerateImage:", error)
    // On peut ajouter ici des métriques ou de la télémétrie
    throw error
  }
}
