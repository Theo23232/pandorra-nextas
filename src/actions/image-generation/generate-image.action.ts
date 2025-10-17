import {revalidatePath} from "next/cache";
import {reduceCredit} from "@/actions/credits.actions";
import {leonardoGenerateImage} from "@/lib/leonardo/fetch";
import {currentUser} from "@/lib/current-user";
import { SA } from "@/lib/safe-ation"
import {User} from "@/types/next";

type GeneratePayload = {
    modelId: string
    prompt: string
    presetStyle: string
    contrastRatio: number
    num_images: number
    height: number
    width: number
    imagePrompts?: string[]
    imageCost: number
}

export const generateImageAction = SA(async (user: User,payload: GeneratePayload)=> {

    try {
        const totalToReduce = payload.num_images * payload.imageCost
        await reduceCredit(totalToReduce)

        const response = await leonardoGenerateImage({
            method: "POST",
            data: {
                alchemy:
                    payload.modelId !== "b2614463-296c-462a-9586-aafdb8f00e36",
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

        return { success: true, data: response }
    } catch (err: any) {
        console.error("generateImageAction error:", err)
        return { success: false, error: err?.message ?? "Generation failed" }
    }
})
