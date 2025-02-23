import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.params?.userId;
    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    return user?.avatar;
  } catch (error: any) {
    console.error("Get avatar error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to get avatar",
    });
  }
});
