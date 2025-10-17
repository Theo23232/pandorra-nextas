"use server"
import { SA } from "@/lib/safe-ation"

import { User } from "@/types/next"
import { ImageGenerationRepositoryImpl } from "./data/repository.prisma"
import { ImageGenerationService } from "./service"
import { ImageGenerationPayload } from "./types"

const service = new ImageGenerationService(new ImageGenerationRepositoryImpl())

/**
 * Server action: triggers image generation using Leonardo via the service layer.
 * Accepts authenticated user (injected by SA) and the payload.
 */
export const generateImage = SA(async (user: User, payload: ImageGenerationPayload) => {
    try {
        const data = await service.generate(payload)
        return { success: true, data }
    } catch (err: any) {
        return { success: false, error: err?.message ?? "Generation failed" }
    }
})


