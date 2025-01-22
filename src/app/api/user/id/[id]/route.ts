// api/user/[id]/route.ts

import { NextResponse } from 'next/server';

import { prisma } from '@/prisma';

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params;
  const user = await prisma.user.findFirst({
    where: {
      id: id as string,
    },
  });
  return NextResponse.json(user, { status: 200 });
};
