import { create } from "zustand"

type ImageLoadingState = {
    imageLoadingCount: number
    setImageNumber: (n: number) => void
    reset: () => void
}

export const useImageLoadingStore = create<ImageLoadingState>((set) => ({
    imageLoadingCount: 0,
    setImageNumber: (n) => set({ imageLoadingCount: n }),
    reset: () => set({ imageLoadingCount: 0 }),
}))
