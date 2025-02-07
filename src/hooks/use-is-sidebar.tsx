import { create } from "zustand"

type Loading = {
  isSidebar: boolean
  toggleSidebar: () => void
}

export const useIsSidebar = create<Loading>((set) => ({
  isSidebar: false,
  toggleSidebar: () => set((state) => ({ isSidebar: !state.isSidebar })),
}))
