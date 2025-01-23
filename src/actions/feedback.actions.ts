'use server';

import { currentUser } from '@/lib/current-user';
import { prisma } from '@/prisma';

export const createFeedback = async (feedbackType: string, message: string, rating: number) => {
  const user = await currentUser();
  if (!user) throw new Error('You are not authentified');
  await prisma.feedback.create({
    data: {
      feedbackType,
      userId: user.id,
      message,
      rating,
    },
  });
};
