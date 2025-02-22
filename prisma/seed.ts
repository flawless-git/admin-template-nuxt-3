import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  console.log({ admin })

  // Create regular user
  const userPassword = await hash('user123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'user@user.com' },
    update: {},
    create: {
      email: 'user@user.com',
      username: 'user',
      password: userPassword,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  console.log({ user })

  // Create some test posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'First Post',
        content: 'This is our first test post',
        published: true,
        authorId: admin.id,
      }
    }),
    prisma.post.create({
      data: {
        title: 'Second Post',
        content: 'This is our second test post',
        published: true,
        authorId: admin.id,
      }
    }),
    prisma.post.create({
      data: {
        title: 'Draft Post',
        content: 'This is a draft post',
        published: false,
        authorId: user.id,
      }
    })
  ])

  console.log({ posts })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
