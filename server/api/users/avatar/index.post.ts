import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No files uploaded",
      });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedFiles = formData.map((file) => {
      if (!file.filename) {
        throw createError({
          statusCode: 400,
          message: "Invalid file upload",
        });
      }

      const filename = `${Date.now()}-${file.filename}`;
      const filepath = path.join(uploadDir, filename);

      fs.writeFileSync(filepath, file.data);

      return {
        filename: file.filename,
        path: `/uploads/${filename}`,
        mimetype: file.type,
        size: file.data.length,
      };
    });

    return {
      success: true,
      files: uploadedFiles,
    };
  } catch (error: any) {
    console.error("Upload error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to upload files",
    });
  }
});
