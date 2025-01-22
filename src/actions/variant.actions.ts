'use server';

import { prisma } from '@/prisma';

export const removeVariant = async (imageId: string) => {
  await prisma.userImage.delete({
    where: { id: imageId },
  });

  await prisma.variant.deleteMany({
    where: { variantId: imageId },
  });
};
