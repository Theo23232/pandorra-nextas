import { create } from 'zustand';

type TShow = {
  isShow: boolean
  toggleShow: () => void
  show: () => void
  hide: () => void
}

export const useShowZeroPayement = create<TShow>((set) => ({
  isShow: false,
  toggleShow: () => set((state) => ({ isShow: !state.isShow })),
  show: () => set((state) => ({ isShow: true })),
  hide: () => set((state) => ({ isShow: false })),
}))
