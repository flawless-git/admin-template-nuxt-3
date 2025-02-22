import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id);
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    if (!post) {
      throw createError({
        statusCode: 404,
        message: "Post not found"
      });
    }

    return post;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch post"
    });
  }
});
