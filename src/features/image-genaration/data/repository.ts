import { GeneratedImage, Generation } from "@prisma/client"
import { PaginatedParams, PaginatedResult } from "../types"

/**
 * Repository contract for image generation data access.
 */
export interface ImageGenerationRepository {
    /**
     * Returns paginated generations for a user, newest first.
     */
    listUserGenerations(
        userId: string,
        params?: PaginatedParams,
    ): Promise<PaginatedResult<Generation & { generated_images: GeneratedImage[] }>>
}


