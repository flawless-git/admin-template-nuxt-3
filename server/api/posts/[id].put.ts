import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const updatePostSchema = z.object({
  title: z
    .string()
    .min(3, "Title minimal 3 karakter")
    .max(255, "Title maksimal 255 karakter"),
  content: z.string().min(10, "Content minimal 10 karakter"),
  published: z.boolean().default(false),
});

export default defineEventHandler(async (event) => {
  try {
    // Get and validate ID
    const id = Number(event.context.params?.id);
    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: "Invalid post ID",
      });
    }

    // Get and validate body
    const body = await readBody(event);
    const data = updatePostSchema.parse(body);

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        message: "Post not found",
      });
    }

    // Update post
    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return post;
  } catch (error: any) {
    console.error("Update post error:", error);

    if (error.name === "ZodError") {
      throw createError({
        statusCode: 400,
        message: `Validation error: ${error.errors
          .map((e: any) => e.message)
          .join(", ")}`,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update post",
    });
  }
});
