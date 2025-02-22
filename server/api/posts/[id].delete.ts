import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id);

    await prisma.post.delete({
      where: { id },
    });

    return {
      message: "Post deleted successfully",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to delete post",
    });
  }
});
