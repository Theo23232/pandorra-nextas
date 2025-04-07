"use server"

import { revalidatePath } from 'next/cache';

import {
    checkRequestStatus, EffectScene, getRequestResult, submitImageToVideoRequest,
    submitTextToVideoRequest, submitVideoEffectsRequest
} from '@/lib/fal-api';
import { prisma } from '@/prisma';

export async function createImageToVideoGeneration(formData: FormData) {
    const prompt = formData.get("prompt") as string
    const imageUrl = formData.get("imageUrl") as string
    const duration = formData.get("duration") as string
    const aspectRatio = formData.get("aspectRatio") as string
    const negativePrompt = formData.get("negativePrompt") as string
    const cfgScale = Number.parseFloat(formData.get("cfgScale") as string)

    if (!prompt || !imageUrl) {
        return { success: false, error: "Prompt and image URL are required" }
    }

    const result = await submitImageToVideoRequest({
        prompt,
        imageUrl,
        duration,
        aspectRatio,
        negativePrompt,
        cfgScale,
    })

    revalidatePath("/video")
    return result
}

export async function createTextToVideoGeneration(formData: FormData) {
    const prompt = formData.get("prompt") as string
    const duration = formData.get("duration") as string
    const aspectRatio = formData.get("aspectRatio") as string
    const negativePrompt = formData.get("negativePrompt") as string
    const cfgScale = Number.parseFloat(formData.get("cfgScale") as string)

    if (!prompt) {
        return { success: false, error: "Prompt is required" }
    }

    const result = await submitTextToVideoRequest({
        prompt,
        duration,
        aspectRatio,
        negativePrompt,
        cfgScale,
    })
    revalidatePath("/video")

    return result
}

export async function createVideoEffectsGeneration(formData: FormData) {
    console.log('formData ==> ', formData)
    const effectScene = formData.get("effectScene") as EffectScene
    const duration = formData.get("duration") as string

    // Get image URLs based on effect type
    let inputImageUrls: string[] = []
    let imageUrl: string | undefined

    if (["hug", "kiss", "heart_gesture"].includes(effectScene)) {
        const image1 = formData.get("image1") as string
        const image2 = formData.get("image2") as string

        if (!image1 || !image2) {
            return { success: false, error: "Two images are required for this effect" }
        }

        inputImageUrls = [image1, image2]

        console.log("Two-image effect:", {
            effectScene,
            duration,
            inputImageUrls,
        })

        return await submitVideoEffectsRequest({
            inputImageUrls,
            effectScene,
            duration,
        })
    } else if (["squish", "expansion"].includes(effectScene)) {
        imageUrl = formData.get("imageUrl") as string

        if (!imageUrl) {
            return { success: false, error: "An image is required for this effect" }
        }

        console.log("Single-image effect:", {
            effectScene,
            duration,
            imageUrl,
        })

        return await submitVideoEffectsRequest({
            imageUrl,
            effectScene,
            duration,
        })
    }

    return { success: false, error: "Invalid effect type" }
}

export async function pollRequestStatus(requestId: string, videoGenerationId: string) {
    const statusResult = await checkRequestStatus(requestId)
    console.log(statusResult.status)
    console.log("process: ", requestId)

    if (statusResult.status === "COMPLETED") {
        const result = await getRequestResult(requestId, videoGenerationId)
        revalidatePath("/video")
        return result
    }

    return statusResult
}

export async function getVideoGenerations() {
    const generations = await prisma.videoGeneration.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })

    return generations
}

