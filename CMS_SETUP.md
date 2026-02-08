# My Kasih CMS - Complete Setup Guide

## 📋 Overview

This is a fullstack CMS system integrated into the Next.js application for managing romantic content including memories, gallery items, and letters. The system features:

- **Token-based authentication** for secure dashboard access
- **PostgreSQL database** with Prisma ORM for data persistence
- **Supabase Storage** integration for media file management
- **RESTful API** for content management (CRUD operations)
- **Admin Dashboard** UI for managing content without coding
- **Audit logging** for tracking all content changes
- **Type-safe operations** with TypeScript and Zod validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Supabase account (optional, for media storage)

### Environment Setup

1. **Copy `.env.example` to `.env.local`:**

   ```bash
   cp .env.example .env.local
   ```

2. **Configure Database:**

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/my-kasih"
   ```

3. **Configure Supabase (Optional):**

   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="eyJxxxxx"
   ```

4. **Set Dashboard Access Token:**
   ```env
   DASHBOARD_KEY="your-secure-token-here"
   ```

### Database Setup

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed database with sample data (optional)
npm run db:seed

# Open Prisma Studio to view data
npm run db:studio
```

### Start Development Server

```bash
npm run dev
```

Visit:

- **Website**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard/login
- **Database Studio**: Run `npm run db:studio`

## 🔐 Authentication

### Dashboard Login

1. Navigate to `/dashboard/login`
2. Enter your `DASHBOARD_KEY` token
3. You'll be authenticated and redirected to the dashboard

### API Authentication

All API requests require the `X-Dashboard-Token` header:

```typescript
const token = sessionStorage.getItem("dashboard_token");
const response = await fetch("/api/memories", {
  headers: {
    "X-Dashboard-Token": token,
  },
});
```

## 📚 API Reference

### Base URL

```
/api
```

### Authentication Header

```
X-Dashboard-Token: your-dashboard-key
```

### Content Types

#### 1. Memories

Narrative moments with text and optional cover image.

- **GET** `/api/memories` - List all memories

  ```typescript
  // Response
  Array<{
    id: string;
    date: string; // ISO date
    title: string;
    description: string;
    emoji: string;
    coverId?: string;
    cover?: { publicUrl: string };
    publishedAt?: string;
  }>;
  ```

- **POST** `/api/memories` - Create memory

  ```typescript
  // Request
  {
    date: string; // ISO date
    title: string;
    description: string;
    emoji: string; // single emoji
    coverId?: string; // optional cover image ID
  }
  ```

- **GET** `/api/memories/[id]` - Get single memory

- **PATCH** `/api/memories/[id]` - Update memory

  ```typescript
  // Request (partial update)
  {
    date?: string;
    title?: string;
    description?: string;
    emoji?: string;
    coverId?: string;
  }
  ```

- **DELETE** `/api/memories/[id]` - Delete memory

#### 2. Gallery

Photo collection with titles and descriptions.

- **GET** `/api/gallery` - List all gallery items

  ```typescript
  // Response
  Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    imageId: string;
    image: { publicUrl: string };
  }>;
  ```

- **POST** `/api/gallery` - Create gallery item

  ```typescript
  // Request
  {
    title: string;
    description: string;
    imageId: string; // required for gallery
  }
  ```

- **GET** `/api/gallery/[id]` - Get single item

- **PATCH** `/api/gallery/[id]` - Update gallery item

- **DELETE** `/api/gallery/[id]` - Delete gallery item

#### 3. Letters

Love letters with content and optional cover image.

- **GET** `/api/letters` - List all letters

  ```typescript
  // Response
  Array<{
    id: string;
    title: string;
    content: string;
    order: number;
    published: boolean;
    imageId?: string;
    image?: { publicUrl: string };
  }>;
  ```

- **POST** `/api/letters` - Create letter

  ```typescript
  // Request
  {
    title: string;
    content: string;
    published?: boolean;
    imageId?: string;
  }
  ```

- **GET** `/api/letters/[id]` - Get single letter

- **PATCH** `/api/letters/[id]` - Update letter

- **DELETE** `/api/letters/[id]` - Delete letter

#### 4. Media

Image files with metadata.

- **POST** `/api/media/upload` - Upload image

  ```typescript
  // Request (FormData)
  formData.append('file', File);

  // Response
  {
    id: string;
    fileName: string;
    filePath: string;
    publicUrl: string;
    mimeType: string;
    size: number;
    width?: number;
    height?: number;
  }
  ```

- **GET** `/api/media/[id]` - Get media metadata

- **DELETE** `/api/media/[id]` - Delete media (only if not in use)

### Error Responses

- **400** - Validation error

  ```json
  { "error": "string", "details": [...] }
  ```

- **401** - Authentication failed

  ```json
  { "error": "Unauthorized" }
  ```

- **404** - Resource not found

  ```json
  { "error": "Memory not found" }
  ```

- **409** - Conflict (media in use)

  ```json
  { "error": "Cannot delete media that is being used" }
  ```

- **500** - Server error
  ```json
  { "error": "Internal server error" }
  ```

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/verify/        # Token verification
│   ├── memories/          # Memory CRUD endpoints
│   ├── gallery/           # Gallery CRUD endpoints
│   ├── letters/           # Letter CRUD endpoints
│   └── media/             # Media upload/delete
├── dashboard/
│   ├── layout.tsx         # Dashboard wrapper with auth
│   ├── page.tsx           # Dashboard home
│   ├── memories/          # Memory management UI
│   ├── gallery/          # Gallery management UI
│   ├── letters/          # Letter management UI
│   ├── settings/         # Settings page
│   └── login/            # Login page
├── layout.tsx
└── page.tsx

services/
├── content.service.ts     # Business logic for content
├── media.service.ts       # Media upload/delete logic
└── index.ts

repositories/
├── content.repository.ts  # Data access for content
├── media.repository.ts    # Data access for media
└── index.ts

lib/
├── prisma.ts             # Prisma client singleton
└── validators/
    ├── auth.ts           # Authentication validation
    └── content.ts        # Content validation schemas

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seed script

hooks/
└── useFetch.ts          # Custom fetch hook with auth

components/dashboard/
├── ConfirmDialog.tsx    # Reusable delete confirmation
└── MediaUploader.tsx    # Image upload component
```

## 🗄️ Database Schema

### Models

**Media**

- id, fileName, filePath, publicUrl, mimeType, size, width?, height?
- Relations: Memory (cover), Gallery (image), Letter (image)

**Memory**

- id, date, title, description, emoji, coverId?, publishedAt?
- Relations: Media (cover)

**Gallery**

- id, title, description, order, imageId
- Relations: Media (image)

**Letter**

- id, title, content, order, published, imageId?
- Relations: Media (image)

**AuditLog**

- id, action, entityType, entityId, ipAddress, userAgent, timestamp
- Tracks all CREATE, UPDATE, DELETE operations

**Settings**

- id, key, value
- System configuration key-value pairs

## 📝 Usage Examples

### Create a Memory via API

```bash
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -H "X-Dashboard-Token: your-token" \
  -d '{
    "date": "2024-01-15T00:00:00Z",
    "title": "Our First Meeting",
    "description": "The day we met...",
    "emoji": "💕"
  }'
```

### Delete a Memory

```bash
curl -X DELETE http://localhost:3000/api/memories/memory-id \
  -H "X-Dashboard-Token: your-token"
```

### Upload Media

```bash
curl -X POST http://localhost:3000/api/media/upload \
  -H "X-Dashboard-Token: your-token" \
  -F "file=@image.jpg"
```

## 🔍 Debugging

### Enable Prisma Logging

```env
DEBUG="prisma:*"
```

### View Database

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555

### Check API Auth

```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "X-Dashboard-Token: your-token"
```

## 📱 Dashboard Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** - Content changes immediately reflected
- **Media Management** - Upload, preview, and manage images
- **Audit Trail** - All changes tracked with IP and user agent
- **Token Security** - Session-based authentication
- **Form Validation** - Client and server-side validation

## 🛡️ Security

1. **Token Authentication**
   - All API endpoints require valid `DASHBOARD_KEY` token
   - Token validated on every request

2. **Input Validation**
   - Zod schemas validate all inputs
   - File type and size restrictions on uploads

3. **Database Constraints**
   - Foreign key relationships enforced
   - Unique constraints on important fields
   - Cascade deletes for orphaned records

4. **Audit Logging**
   - All mutations logged with IP and user agent
   - Timestamp tracking for all operations

## 🚢 Deployment

### Prepare for Production

1. **Environment Variables**

   ```env
   # Use strong, randomly generated token
   DASHBOARD_KEY=your-very-secure-random-token-256-chars

   # Production database
   DATABASE_URL=postgresql://prod-user:pwd@prod-host:5432/db

   # Supabase for media
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyxxx
   ```

2. **Database Migration**

   ```bash
   npm run db:migrate -- --name init
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   npm start
   ```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add DASHBOARD_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Support

For issues or questions, refer to the API documentation in Dashboard Settings or check the console logs.

## 📄 License

This CMS is part of the My Kasih romantic website project.
