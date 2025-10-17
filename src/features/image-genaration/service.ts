import { reduceCredit } from "@/actions/credits.actions"
import { currentUser } from "@/lib/current-user"
import { leonardoGenerateImage } from "@/lib/leonardo/fetch"
import { revalidatePath } from "next/cache"

import { GeneratedImage, Generation } from "@prisma/client"
import { ImageGenerationRepository } from "./data/repository"
import { ImageGenerationPayload, PaginatedParams, PaginatedResult } from "./types"

/**
 * Business logic for image generation.
 */
export class ImageGenerationService {
    constructor(private readonly repo: ImageGenerationRepository) { }

    async generate(payload: ImageGenerationPayload) {
        const user = await currentUser()
        if (!user) throw new Error("Unauthorized")

        const totalToReduce = payload.num_images * payload.imageCost
        await reduceCredit(totalToReduce)

        const response = await leonardoGenerateImage({
            method: "POST",
            data: {
                alchemy: payload.modelId !== "b2614463-296c-462a-9586-aafdb8f00e36",
                height: payload.height,
                width: payload.width,
                modelId: payload.modelId,
                contrastRatio: payload.contrastRatio,
                num_images: payload.num_images,
                prompt: payload.prompt,
                presetStyle: payload.presetStyle,
                imagePrompts: payload.imagePrompts ?? [],
            },
        })

        revalidatePath("/image")
        revalidatePath("/api/generation")
        return response
    }

    async listMine(
        userId: string,
        params?: PaginatedParams,
    ): Promise<PaginatedResult<Generation & { generated_images: GeneratedImage[] }>> {
        return this.repo.listUserGenerations(userId, params)
    }
}


