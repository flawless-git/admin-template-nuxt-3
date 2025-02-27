# Database Sheet

A modern database management system built with Nuxt 3, Vue 3, and Shadcn Vue.

## Features

- 🔐 Authentication & Authorization
- 👥 User Management
- 📝 Post Management
- 🎨 Theme Switching (Light/Dark)
- 🔍 Global Search
- 📱 Responsive Design
- 🔒 Protected Routes (/admin)
- 🎯 Form Validation
- 💾 Data Persistence

## Tech Stack

- **Framework:** [Nuxt 3](https://nuxt.com)
- **UI Components:** [Shadcn Vue](https://www.shadcn-vue.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **State Management:** [Pinia](https://pinia.vuejs.org)
- **Database:** [Prisma](https://www.prisma.io/)
- **Form Validation:** [Vee Validate](https://vee-validate.logaretm.com/v4/) + [Zod](https://zod.dev)
- **Icons:** [Lucide Icons](https://lucide.dev)

## Project Structure

```
├── components/          # Vue components
│   ├── ui/             # Shadcn Vue components
│   └── ...             # Custom components
├── composables/        # Vue composables
├── layouts/            # Page layouts
├── pages/             # File-based routing
├── prisma/            # Database schema and migrations
├── public/            # Static assets
├── server/            # API routes
│   └── api/           # API endpoints
├── stores/            # Pinia stores
└── types/             # TypeScript types
```

## API Routes

```
# Authentication Routes
POST    /api/auth/login         # Login user
POST    /api/auth/logout        # Logout user
GET     /api/auth/me            # Get current user

# User Routes
GET     /api/users             # Get all users
POST    /api/users             # Create user
GET     /api/users/:id         # Get user by ID
PUT     /api/users/:id         # Update user
DELETE  /api/users/:id         # Delete user

# User Avatar Routes
POST    /api/users/avatar/:userId    # Upload user avatar
DELETE  /api/users/avatar/:userId    # Delete user avatar
GET     /api/users/avatar/:userId    # Get user avatar

# Post Routes
GET     /api/posts             # Get all posts
POST    /api/posts             # Create post
GET     /api/posts/:id         # Get post by ID
PUT     /api/posts/:id         # Update post
DELETE  /api/posts/:id         # Delete post
GET     /api/posts/search      # Search posts
GET     /api/posts/published   # Get published posts
```

## Setup

Make sure to install dependencies:

```bash
npm install
```

## Scripts

```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run cleanup       # Cleanup cache files

# Database
npx prisma studio    # Start Prisma Studio
npx prisma db push   # Push schema changes to database
npx prisma generate  # Generate Prisma Client
npx prisma db seed   # Seed the database
npx prisma reset     # Reset database and run seeds
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
```

## Database Setup

```bash
npx prisma generate
npx prisma migrate dev --name dev
npx prisma db seed
```

## Default User

After running database seeds, you can login with these credentials:

```bash
# Admin User
Username: admin
Password: admin123

# Regular User
Username: user
Password: user123
```

## Development Server

```bash
npm run dev
```

Start the development server on `http://localhost:3000`:
