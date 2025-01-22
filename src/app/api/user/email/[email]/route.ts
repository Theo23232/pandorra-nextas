// api/user/[email]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export const GET = async (request: Request, { params }: { params: { email: string } }) => {
  const { email } = params;
  const user = await prisma.user.findFirst({
    where: {
      email: email as string,
    },
  });
  if (user) {
    return NextResponse.json(false, { status: 200 });
  } else {
    return NextResponse.json(true, { status: 200 });
  }
};
