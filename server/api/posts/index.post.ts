import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// Create a single PrismaClient instance
const prisma = new PrismaClient();

const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title minimal 3 karakter")
    .max(255, "Title maksimal 255 karakter")
    .trim(),
  content: z.string().min(10, "Content minimal 10 karakter").trim(),
  published: z.boolean(),
  authorId: z.string().uuid("Invalid author ID"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Received request body:", body);

    // Parse and validate the request body
    const data = createPostSchema.parse(body);
    console.log("Validated data:", data);

    // First check if author exists
    const author = await prisma.user.findUnique({
      where: { id: data.authorId },
    });

    if (!author) {
      throw createError({
        statusCode: 400,
        message: "Author not found",
      });
    }

    // Create post using transaction
    const post = await prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          title: data.title,
          content: data.content,
          published: data.published,
          authorId: data.authorId,
        },
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

      console.log("Created post:", created);
      return created;
    });

    return post;
  } catch (error: any) {
    console.error("Create post error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta,
    });

    if (error.code === "P2003") {
      throw createError({
        statusCode: 400,
        message: "Invalid author ID or author does not exist",
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create post",
    });
  } finally {
    await prisma.$disconnect();
  }
});
