"use client"
import { generateImage } from "@/features/image-genaration/actions"
import { useImageGenerationStore, useImageLoadingStore } from "@/features/image-genaration/store"
import { ImageGenerationPayload } from "@/features/image-genaration/types"
import { useImageCost } from "@/hooks/use-image-cost"
import { useSelectImage } from "@/hooks/use-select-image"
import { useToast } from "@/hooks/use-toast"
import { useCallback } from "react"

export function useGenerateImage() {
    const { toast } = useToast()
    const { imageUrl } = useSelectImage()
    const { imageCost } = useImageCost()
    const { setImageNumber } = useImageLoadingStore()
    const {
        prompt,
        activeModel,
        presetStyle,
        contrast,
        count,
        width,
        height,
    } = useImageGenerationStore()

    const generate = useCallback(async () => {
        const payload: ImageGenerationPayload = {
            modelId: activeModel.id,
            height,
            width,
            contrastRatio: contrast == "Medium" ? 0.5 : contrast == "Low" ? 0 : 1,
            num_images: count,
            prompt,
            presetStyle,
            imagePrompts: imageUrl ? [imageUrl] : [],
            imageCost: imageCost,
        }
        setImageNumber(count)
        try {
            const res = await (generateImage as unknown as (p: ImageGenerationPayload) => Promise<any>)(payload)
            if (!res?.success) {
                toast({ title: "Generation error", description: res?.error ?? "", variant: "error", duration: 3000 })
            }
        } catch (e) {
            toast({ title: "Generation error", description: "", variant: "error", duration: 3000 })
        }
        setImageNumber(0)
    }, [activeModel.id, height, width, contrast, count, prompt, presetStyle, imageUrl, imageCost, setImageNumber, toast])

    return { generate }
}


