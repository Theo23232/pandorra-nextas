import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var globalPrisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const prisma = globalThis.globalPrisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.globalPrisma = prisma
