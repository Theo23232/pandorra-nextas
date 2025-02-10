import { create } from "zustand"

type Loading = {
  isModal: boolean
  toggleModal: () => void
  openModal: () => void
  closeModal: () => void
}

export const useIsModal = create<Loading>((set) => ({
  isModal: false,
  toggleModal: () => set((state) => ({ isModal: !state.isModal })),
  openModal: () => set(() => ({ isModal: true })),
  closeModal: () => set(() => ({ isModal: false })),
}))
