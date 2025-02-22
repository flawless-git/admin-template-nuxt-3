import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();

const updateUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email().max(255),
  password: z.string().min(6).max(32).optional(),
  role: z.enum(["ADMIN", "USER"]),
});

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        message: "User ID is required",
      });
    }

    const data = updateUserSchema.parse(body);

    // Check if email/username is taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email.toLowerCase() },
          { username: data.username.toLowerCase() },
        ],
        NOT: { id },
      },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Email atau username sudah digunakan",
      });
    }

    const updateData: any = {
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      role: data.role,
    };

    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error: any) {
    console.error("Update user error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update user",
    });
  }
});
