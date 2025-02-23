import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();

const createUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email().max(255),
  password: z.string().min(6).max(32),
  role: z.enum(["ADMIN", "USER"]),
});

export default defineEventHandler(async (event) => {
  try {
    // Validate request body exists
    const body = await readBody(event);
    if (!body) {
      throw createError({
        statusCode: 400,
        message: "Request body is required",
      });
    }

    // Validate schema
    let data;
    try {
      data = createUserSchema.parse(body);
    } catch (zodError: any) {
      throw createError({
        statusCode: 400,
        message: `Validation error: ${zodError.errors
          ?.map((e: any) => e.message)
          .join(", ")}`,
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email.toLowerCase() },
          { username: data.username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Email atau username sudah digunakan",
      });
    }

    // Create user
    try {
      const hashedPassword = await hash(data.password, 10);
      const user = await prisma.user.create({
        data: {
          username: data.username.toLowerCase(),
          email: data.email.toLowerCase(),
          password: hashedPassword,
          role: data.role,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      throw createError({
        statusCode: 500,
        message: "Failed to create user in database",
      });
    }
  } catch (error: any) {
    console.error("Create user error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create user",
    });
  }
});
