import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const authorization = getHeader(event, 'Authorization')

    if (!authorization?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const token = authorization.split(' ')[1]
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Token tidak valid'
      })
    }

    // Extract user ID from token (dummy-token-UUID-TIMESTAMP)
    const tokenParts = token.split('-')
    if (tokenParts.length < 7) { // UUID has 5 parts when split by '-'
      throw createError({
        statusCode: 401,
        message: 'Format token tidak valid'
      })
    }
    
    // Reconstruct UUID from parts (parts 2-6)
    const userId = tokenParts.slice(2, 7).join('-')
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'User tidak ditemukan'
      })
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}) 