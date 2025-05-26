"use server"

import { currentUser } from '@/lib/current-user';
import { prisma } from '@/prisma';

interface FalResponse {
  request_id: string
  status: string
  output?: {
    video: {
      url: string
      content_type: string
      file_name: string
      file_size: number
    }
  }
}

export type EffectScene = "hug" | "kiss" | "heart_gesture" | "squish" | "expansion"

export async function submitImageToVideoRequest(data: {
  prompt: string
  imageUrl: string
  duration: string
  aspectRatio: string
  negativePrompt?: string
  cfgScale?: number
}) {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error("User not authenticated")
    }
    // Create a record in the database
    const videoGeneration = await prisma.videoGeneration.create({
      data: {
        userId: user.id,
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        duration: data.duration || "5",
        aspectRatio: data.aspectRatio || "16:9",
        negativePrompt: data.negativePrompt || "blur, distort, and low quality",
        cfgScale: data.cfgScale || 0.5,
        type: "image-to-video",
        status: "pending",
      },
    })

    // Submit the request to Fal AI
    const response = await fetch("https://queue.fal.run/fal-ai/kling-video/v2/master/image-to-video", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.prompt,
        image_url: data.imageUrl,
        duration: data.duration,
        aspect_ratio: data.aspectRatio,
        negative_prompt: data.negativePrompt || "blur, distort, and low quality",
        cfg_scale: data.cfgScale || 0.5,
      }),
    })

    const result = (await response.json()) as FalResponse

    // Update the database record with the request ID
    await prisma.videoGeneration.update({
      where: { id: videoGeneration.id },
      data: {
        requestId: result.request_id,
        status: "processing",
      },
    })

    return { success: true, videoGeneration: { ...videoGeneration, requestId: result.request_id } }
  } catch (error) {
    console.error("Error submitting image to video request:", error)
    return { success: false, error: "Failed to submit request" }
  }
}

export async function submitTextToVideoRequest(data: {
  prompt: string
  duration: string
  aspectRatio: string
  negativePrompt?: string
  cfgScale?: number
}) {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error("User not authenticated")
    }
    // Create a record in the database
    const videoGeneration = await prisma.videoGeneration.create({
      data: {
        userId: user.id,
        prompt: data.prompt,
        duration: data.duration || "5",
        aspectRatio: data.aspectRatio || "16:9",
        negativePrompt: data.negativePrompt || "blur, distort, and low quality",
        cfgScale: data.cfgScale || 0.5,
        type: "text-to-video",
        status: "pending",
      },
    })

    // Submit the request to Fal AI
    const response = await fetch("https://queue.fal.run/fal-ai/kling-video/v2/master/text-to-video", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.prompt,
        duration: data.duration,
        aspect_ratio: data.aspectRatio,
        negative_prompt: data.negativePrompt || "blur, distort, and low quality",
        cfg_scale: data.cfgScale || 0.5,
      }),
    })

    const result = (await response.json()) as FalResponse

    // Update the database record with the request ID
    await prisma.videoGeneration.update({
      where: { id: videoGeneration.id },
      data: {
        requestId: result.request_id,
        status: "processing",
      },
    })

    return { success: true, videoGeneration: { ...videoGeneration, requestId: result.request_id } }
  } catch (error) {
    console.error("Error submitting text to video request:", error)
    return { success: false, error: "Failed to submit request" }
  }
}

export async function submitVideoEffectsRequest(data: {
  inputImageUrls?: string[]
  imageUrl?: string
  effectScene: EffectScene
  duration: string
}) {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error("User not authenticated")
    }
    // Create a record in the database
    const videoGeneration = await prisma.videoGeneration.create({
      data: {
        userId: user.id,
        prompt: `Effect: ${data.effectScene}`,
        imageUrl:
          data.imageUrl || (data.inputImageUrls && data.inputImageUrls.length > 0 ? data.inputImageUrls[0] : undefined),
        duration: data.duration || "5",
        type: "video-effects",
        status: "pending",
      },
    })

    // Prepare the request body based on the effect type
    const requestBody: any = {
      effect_scene: data.effectScene,
      duration: data.duration,
    }

    // For hug, kiss, heart_gesture effects, we need both input_image_urls AND image_url
    if (["hug", "kiss", "heart_gesture"].includes(data.effectScene) && data.inputImageUrls) {
      requestBody.input_image_urls = data.inputImageUrls
      // The API seems to require image_url even for effects that use input_image_urls
      // Use the first image as the image_url
      requestBody.image_url = data.inputImageUrls[0]
    } else if (["squish", "expansion"].includes(data.effectScene) && data.imageUrl) {
      requestBody.image_url = data.imageUrl
    }

    console.log("Effects API request body:", JSON.stringify(requestBody, null, 2))

    // Submit the request to Fal AI
    const response = await fetch("https://queue.fal.run/fal-ai/kling-video/v1.6/pro/effects", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    const result = await response.json()

    if (result.detail) {
      console.error("API Error:", result)
      return { success: false, error: `API Error: ${JSON.stringify(result.detail)}` }
    }

    // Update the database record with the request ID
    await prisma.videoGeneration.update({
      where: { id: videoGeneration.id },
      data: {
        requestId: result.request_id,
        status: "processing",
      },
    })

    return { success: true, videoGeneration: { ...videoGeneration, requestId: result.request_id } }
  } catch (error) {
    console.error("Error submitting video effects request:", error)
    return { success: false, error: "Failed to submit request" }
  }
}

export async function checkRequestStatus(requestId: string) {
  try {
    const response = await fetch(`https://queue.fal.run/fal-ai/kling-video/requests/${requestId}/status`, {
      method: "GET",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
      },
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error checking request status:", error)
    return { success: false, error: "Failed to check request status" }
  }
}

export async function getRequestResult(requestId: string, videoGenerationId: string) {
  try {
    const response = await fetch(`https://queue.fal.run/fal-ai/kling-video/requests/${requestId}`, {
      method: "GET",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
      },
    })

    const result = (await response.json()) as {
      video: { url: string; content_type: string; file_name: string; file_size: number }
    }
    if ((result as any)?.detail) {
      await prisma.videoGeneration.update({
        where: { id: videoGenerationId },
        data: {
          status: "error",
          errorMessage: JSON.stringify((result as any).detail[0].msg),
        },
      })
      return { success: false, error: (result as any).detail }
    }
    if (result?.video?.url) {
      // Update the database record with the video URL
      await prisma.videoGeneration.update({
        where: { id: videoGenerationId },
        data: {
          videoUrl: result.video.url,
          status: "completed",
        },
      })
    }

    return result
  } catch (error) {
    console.error("Error getting request result:", error)
    return { success: false, error: "Failed to get request result" }
  }
}

