"use server"

import axios from "axios"
import fs from "fs"
import path from "path"

import { currentUser } from "@/lib/current-user"
import { prisma } from "@/prisma"
import { GenerationWithImages } from "@/types/pandorra"

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
      authorization: "Bearer c730433c-957b-429a-b2d3-d0ac5f128ba8",
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
): Promise<LeoFetchGenerationResult | undefined> {
  const user = await currentUser()
  if (!user) throw new Error("You are not authenticated")

  const result = await leofetch<LeoFetchGenerationResult>(
    `https://cloud.leonardo.ai/api/rest/v1/generations/${id}`,
    { method: "GET" },
  )

  if (result && result.generations_by_pk) {
    return result
  } else {
    return undefined
  }
}

export const generationInsert = async (
  result: LeoFetchGenerationResult,
): Promise<GenerationWithImages> => {
  const user = await currentUser()
  if (!user) throw new Error("You are not authenticated")
  if (result && result.generations_by_pk) {
    const response = result.generations_by_pk as GenerationWithImages

    if (response.generated_images.length) {
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
