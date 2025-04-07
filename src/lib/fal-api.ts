"use server"


import { prisma } from '@/prisma';

interface FalResponse {
  request_id: string
  status: string
  output?: {
    video: {
      url: string
    }
  }
}

export async function submitImageToVideoRequest(data: {
  prompt: string
  imageUrl: string
  duration: string
  aspectRatio: string
  negativePrompt?: string
  cfgScale?: number
}) {
  try {
    // Create a record in the database
    const videoGeneration = await prisma.videoGeneration.create({
      data: {
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
    const response = await fetch("https://queue.fal.run/fal-ai/kling-video/v1.6/pro/image-to-video", {
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
    // Create a record in the database
    const videoGeneration = await prisma.videoGeneration.create({
      data: {
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
    const response = await fetch("https://queue.fal.run/fal-ai/kling-video/v1.6/pro/text-to-video", {
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

    const result = (await response.json()) as { video: { url: string, content_type: string, file_name: string, file_size: number } }
    console.log('result ==> ', result)
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

