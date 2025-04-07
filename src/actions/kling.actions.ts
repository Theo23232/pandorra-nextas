"use server"

import { revalidatePath } from 'next/cache';

import {
    checkRequestStatus, getRequestResult, submitImageToVideoRequest, submitTextToVideoRequest
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

export async function pollRequestStatus(requestId: string, videoGenerationId: string) {
    const statusResult = await checkRequestStatus(requestId)
    console.log(statusResult.status);
    console.log("process: ", requestId);

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

