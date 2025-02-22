import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "User ID is required",
      });
    }

    // Delete user's posts first
    await prisma.post.deleteMany({
      where: { authorId: id },
    });

    // Then delete the user
    const user = await prisma.user.delete({
      where: { id },
    });

    return user;
  } catch (error: any) {
    console.error("Delete user error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to delete user",
    });
  }
});
