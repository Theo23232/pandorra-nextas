import { create } from 'zustand';

type Loading = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

export const useLoadingStore = create<Loading>((set) => ({
  isLoading: false,
  startLoading: () => set(() => ({ isLoading: true })),
  stopLoading: () => set(() => ({ isLoading: false })),
}));
