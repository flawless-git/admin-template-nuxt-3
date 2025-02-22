import { PrismaClient } from "@prisma/client";
import { getToken } from "../utils/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // List of public endpoints that don't require authentication
  const publicEndpoints = [
    "/api/posts",
    "/api/auth/login",
    "/api/auth/register",
    "/", // Add home page to public endpoints
    "/api/posts/[id]", // Allow viewing individual posts
  ];

  // Skip auth check for public endpoints
  if (
    publicEndpoints.some((endpoint) => event.path.startsWith(endpoint)) ||
    !event.path.startsWith("/api/")
  ) {
    return;
  }

  try {
    const token = getToken(event);
    if (!token || !token.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        message: "Invalid token format",
      });
    }

    // Extract user ID from token (dummy-token-UUID-TIMESTAMP)
    const tokenParts = token.split("-");
    if (tokenParts.length < 7) {
      // UUID has 5 parts when split by '-'
      throw createError({
        statusCode: 401,
        message: "Unauthorized: Invalid token format",
      });
    }

    // Reconstruct UUID from parts (parts 2-6)
    const userId = tokenParts.slice(2, 7).join("-");

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized: User not found",
      });
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;

    // Add user to event context
    event.context.user = userWithoutPassword;
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || "Unauthorized",
    });
  }
});
