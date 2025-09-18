import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;
// CHANGED: Added named export 'db' to fix import issues in auth package
// Reason: @repo/auth was trying to import { db } but only default export was available
export { prisma as db };

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
