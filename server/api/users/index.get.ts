import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    return await prisma.user.findMany({
      include: { posts: true },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        message: error.message,
      });
    }
    throw error;
  }
});
