# 🚀 My Kasih CMS - Developer Quick Reference

## 📱 Dashboard Access

**URL**: `http://localhost:3000/dashboard/login`  
**Token**: Check your `.env.local` file for `DASHBOARD_KEY`  
**Features**: Create, read, update, delete memories, gallery items, and letters

## 📡 API Quick Commands

### Get All Memories

```bash
curl -H "X-Dashboard-Token: your-token" \
  http://localhost:3000/api/memories
```

### Create New Memory

```bash
curl -X POST http://localhost:3000/api/memories \
  -H "X-Dashboard-Token: your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15T00:00:00Z",
    "title": "Our First Meeting",
    "description": "The day we met was magical...",
    "emoji": "💕"
  }'
```

### Upload Image

```bash
curl -X POST http://localhost:3000/api/media/upload \
  -H "X-Dashboard-Token: your-token" \
  -F "file=@image.jpg"
```

### Delete Memory

```bash
curl -X DELETE http://localhost:3000/api/memories/{id} \
  -H "X-Dashboard-Token: your-token"
```

## 🛠️ Common Development Tasks

### Add New Content Type

1. **Update `prisma/schema.prisma`**

   ```prisma
   model MyNewModel {
     id          String  @id @default(cuid())
     title       String
     description String?
     createdAt   DateTime @default(now())
   }
   ```

2. **Run Migration**

   ```bash
   npm run db:migrate -- --name add_new_model
   ```

3. **Create Repository** in `repositories/`
4. **Create Service** in `services/`
5. **Create API Routes** in `app/api/`

### Modify Validation Schema

Edit `/lib/validators/content.ts`:

```typescript
import { z } from "zod";

export const myModelSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
});

export type MyModel = z.infer<typeof myModelSchema>;
```

### Check Database

```bash
# Open Prisma Studio
npm run db:studio

# View with CLI
npx prisma db query
```

### Debug API Issues

1. **Check Server Logs**

   ```bash
   npm run dev  # Watch terminal output
   ```

2. **Enable Prisma Logging**

   ```bash
   DEBUG=prisma:* npm run dev
   ```

3. **Test Endpoint**
   ```bash
   curl -H "X-Dashboard-Token: test" \
     http://localhost:3000/api/memories
   ```

## 📝 Audit Log Reference

View all changes made through the CMS:

```typescript
// In Prisma Studio or database query
SELECT * FROM "AuditLog"
ORDER BY "timestamp" DESC
LIMIT 50;
```

Tracked information:

- `action` - CREATE, UPDATE, DELETE
- `entityType` - Content type (Memory, Gallery, Letter, Media)
- `entityId` - ID of modified resource
- `ipAddress` - User's IP
- `userAgent` - Browser/client info
- `timestamp` - When change occurred

## 🔧 Environment Variables Quick Reference

```env
# Required for everything
DATABASE_URL=postgresql://user:pass@host:5432/db
DASHBOARD_KEY=your-secure-token

# Optional but recommended (for media uploads)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyxxx

# Advanced (optional)
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./public/uploads
```

## 🐛 Common Error Messages

| Error                        | Cause                        | Solution                               |
| ---------------------------- | ---------------------------- | -------------------------------------- |
| "Unauthorized"               | Missing/invalid token        | Check DASHBOARD_KEY in .env.local      |
| "Memory not found"           | Resource deleted or wrong ID | Verify ID exists in database           |
| "Validation error"           | Invalid request body         | Check data types and required fields   |
| "Cannot delete media"        | Image in use by content      | Remove from all memories/gallery first |
| "Database connection failed" | PostgreSQL unavailable       | Check DATABASE_URL and DB status       |

## 📊 Database Schema Quick Reference

```
Memory
  ├── id: string
  ├── date: DateTime
  ├── title: string
  ├── description: string
  ├── emoji: string (1-2 chars)
  ├── coverId?: string → Media
  └── publishedAt?: DateTime

Gallery
  ├── id: string
  ├── title: string
  ├── description: string
  ├── order: number
  ├── imageId: string → Media (required)
  └── createdAt: DateTime

Letter
  ├── id: string
  ├── title: string
  ├── content: string
  ├── order: number
  ├── published: boolean
  ├── imageId?: string → Media
  └── createdAt: DateTime

Media
  ├── id: string
  ├── fileName: string
  ├── filePath: string
  ├── publicUrl: string
  ├── mimeType: string
  ├── size: number
  ├── width?: number
  ├── height?: number
  ├── uploadedAt: DateTime
  └── Relations: usedBy Memory/Gallery/Letter
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set strong `DASHBOARD_KEY` (32+ char random)
- [ ] Configure PostgreSQL production database
- [ ] Set up Supabase for media (or implement local storage)
- [ ] Run `npm run build` without errors
- [ ] Test all API endpoints
- [ ] Verify media upload works
- [ ] Set up database backups
- [ ] Enable HTTPS
- [ ] Configure monitoring/logging
- [ ] Document any custom modifications

## 📚 File Locations Reference

| What                | Where                   |
| ------------------- | ----------------------- |
| API Endpoints       | `app/api/`              |
| Dashboard Pages     | `app/dashboard/`        |
| Validation Rules    | `lib/validators/`       |
| Database Access     | `repositories/`         |
| Business Logic      | `services/`             |
| Custom Hooks        | `hooks/`                |
| Reusable Components | `components/dashboard/` |
| Database Schema     | `prisma/schema.prisma`  |
| Sample Data         | `prisma/seed.ts`        |

## 💡 Pro Tips

1. **Batch Updates via API**
   - Update multiple entries in transaction using `prisma.$transaction()`

2. **Optimize Images**
   - Use Sharp to auto-optimize uploads
   - Supabase auto-resizes with query params: `?width=300&height=300`

3. **Search Functionality**
   - Add full-text search via Postgres `tsvector`
   - Or use Algolia for better UX

4. **Pagination**
   - API supports `skip` and `take` params (add in routes)
   - Prisma: `take: 10, skip: (page-1)*10`

5. **Caching**
   - Use Next.js ISR for dashboard stats
   - Cache API responses with SWR hook

6. **Types**
   - Import types from services:
   ```typescript
   import type { ContentTypes } from "@/services";
   ```

## 🆘 Getting Help

1. Check **CMS_SETUP.md** for setup instructions
2. See **IMPLEMENTATION_SUMMARY.md** for architecture overview
3. Review **Prisma docs** for database questions
4. Check **Next.js docs** for framework questions
5. Review error logs in browser console (F12)
6. Check server logs in terminal running `npm run dev`

---

**Remember**: Always back up your database before major changes! 💾
