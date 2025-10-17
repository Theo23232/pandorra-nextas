import { prisma } from "@/prisma"
import { GeneratedImage, Generation } from "@prisma/client"
import { PaginatedParams, PaginatedResult } from "../types"
import { ImageGenerationRepository } from "./repository"

/**
 * Prisma-backed implementation of ImageGenerationRepository.
 */
export class ImageGenerationRepositoryImpl implements ImageGenerationRepository {
    async listUserGenerations(
        userId: string,
        params?: PaginatedParams,
    ): Promise<PaginatedResult<Generation & { generated_images: GeneratedImage[] }>> {
        const page = Number(params?.page ?? 0)
        const limit = Number(params?.limit ?? 8)

        const items = await prisma.generation.findMany({
            where: { userId },
            include: { generated_images: true },
            orderBy: { createdAt: "desc" },
            skip: page * limit,
            take: limit,
        })

        return { items, page, limit }
    }
}


