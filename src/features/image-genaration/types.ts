export type ImageGenerationPayload = {
    modelId: string
    height: number
    width: number
    contrastRatio: number
    num_images: number
    prompt: string
    presetStyle: string
    imagePrompts?: string[]
    imageCost: number
}

export type PaginatedParams = {
    page?: number
    limit?: number
}

export type PaginatedResult<T> = {
    items: T[]
    page: number
    limit: number
}

