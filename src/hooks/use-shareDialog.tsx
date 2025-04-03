import { create } from 'zustand';

type Props = {
  isShow: boolean
  data: { id: string; image: string }
  setData: (id: string, image: string) => void
}

export const useShareDialog = create<Props>((set) => ({
  isShow: false,
  data: {
    id: "",
    image: "",
  },

  setData: (id: string, image: string) =>
    set(() => ({
      data: { id, image },
    })),
}))
