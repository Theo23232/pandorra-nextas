import { create } from 'zustand';

type status = {
  subStatus: string
  setSubStatus: (subStatus: string) => void
}

export const useSubState = create<status>((set) => ({
  subStatus: "active",
  setSubStatus: (subStatus: string) => set(() => ({ subStatus })),
}))
