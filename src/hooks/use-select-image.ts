import { create } from 'zustand';

type Loading = {
  imageUrl: string | undefined;
  imageId: string | undefined;
  selectImage: (imageUrl: string) => void;
  selectImageId: (imageId: string) => void;
  removeImage: () => void;
};

export const useSelectImage = create<Loading>((set) => ({
  imageUrl: undefined,
  imageId: undefined,
  selectImage: (imageUrl: string) => set(() => ({ imageUrl })),
  selectImageId: (imageId: string) => set(() => ({ imageId })),
  removeImage: () => set(() => ({ imageUrl: undefined })),
}));
