import { create } from "zustand"

type Loading = {
  imageLoading: number
  setImageNumber: (loading: number) => void
}

export const useImageLoading = create<Loading>((set) => ({
  imageLoading: 0,

  setImageNumber: (loading: number) =>
    set(() => ({
      imageLoading: loading,
    })),
}))
