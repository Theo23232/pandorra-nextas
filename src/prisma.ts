import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  // eslint-disable-next-line no-var
  var globalPrisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.globalPrisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.globalPrisma = prisma
