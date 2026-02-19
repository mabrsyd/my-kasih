# 🚀 Alternative Setup - Create Tables via Supabase SQL Editor

Karena `prisma db push` error auth, bisa create tables via Supabase UI yang lebih mudah.

## Langkah-langkah:

1. Buka https://app.supabase.co
2. Pilih project jwdfnuxinqbhtoyrzzfj
3. Klik **SQL Editor** (di sidebar kiri)
4. Klik **"New Query"**
5. Copy-paste SQL schema di bawah
6. Klik **"Run"** tombol biru

---

## SQL Script - Copy and Paste ke SQL Editor:

```sql
-- Create Media table for storing images/files
CREATE TABLE IF NOT EXISTS "public"."Media" (
  "id" text NOT NULL,
  "fileName" varchar(255) NOT NULL,
  "filePath" text NOT NULL,
  "publicUrl" text NOT NULL,
  "mimeType" varchar(100) NOT NULL,
  "size" integer NOT NULL,
  "width" integer,
  "height" integer,
  "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) with time zone NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE("filePath")
);

-- Create Memory table
CREATE TABLE IF NOT EXISTS "public"."Memory" (
  "id" text NOT NULL,
  "date" timestamp(3) with time zone NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "emoji" varchar(10) NOT NULL,
  "coverId" text,
  "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) with time zone NOT NULL,
  "publishedAt" timestamp(3) with time zone,
  PRIMARY KEY ("id"),
  CONSTRAINT "Memory_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "public"."Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create Gallery table
CREATE TABLE IF NOT EXISTS "public"."Gallery" (
  "id" text NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text,
  "order" integer NOT NULL DEFAULT 0,
  "imageId" text NOT NULL,
  "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) with time zone NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE("imageId"),
  CONSTRAINT "Gallery_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Media" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Letter table
CREATE TABLE IF NOT EXISTS "public"."Letter" (
  "id" text NOT NULL,
  "title" varchar(255) NOT NULL,
  "content" text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  "published" boolean NOT NULL DEFAULT false,
  "imageId" text,
  "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) with time zone NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "Letter_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create AuditLog table
CREATE TABLE IF NOT EXISTS "public"."AuditLog" (
  "id" text NOT NULL,
  "action" varchar(50) NOT NULL,
  "entityType" varchar(50) NOT NULL,
  "entityId" varchar(100) NOT NULL,
  "changes" jsonb,
  "ipAddress" varchar(45) NOT NULL,
  "userAgent" text NOT NULL,
  "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

-- Create Settings table
CREATE TABLE IF NOT EXISTS "public"."Settings" (
  "key" varchar(100) NOT NULL,
  "value" text NOT NULL,
  "description" text,
  "updatedAt" timestamp(3) with time zone NOT NULL,
  PRIMARY KEY ("key")
);

-- Create indexes
CREATE INDEX "Media_createdAt_idx" ON "public"."Media"("createdAt");
CREATE INDEX "Media_mimeType_idx" ON "public"."Media"("mimeType");
CREATE INDEX "Memory_date_idx" ON "public"."Memory"("date");
CREATE INDEX "Memory_publishedAt_idx" ON "public"."Memory"("publishedAt");
CREATE INDEX "Gallery_order_idx" ON "public"."Gallery"("order");
CREATE INDEX "Letter_order_idx" ON "public"."Letter"("order");
CREATE INDEX "Letter_published_idx" ON "public"."Letter"("published");
CREATE INDEX "AuditLog_action_createdAt_idx" ON "public"."AuditLog"("action", "createdAt");
CREATE INDEX "AuditLog_ipAddress_createdAt_idx" ON "public"."AuditLog"("ipAddress", "createdAt");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "public"."AuditLog"("entityType", "entityId");
```

---

## Setelah SQL Selesai:

1. **Re-generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

2. **Test endpoints lagi:**

   ```bash
   curl http://localhost:3000/api/gallery
   curl http://localhost:3000/api/memories
   curl http://localhost:3000/api/letters
   ```

3. **Should return 200 OK dengan empty array:**
   ```json
   []
   ```

---

## Status Setelah Ini:

- ✅ Database connected
- ✅ Tables created
- ✅ Endpoints working
- ✅ Ready untuk use dashboard

---

Mari lakukan ini via SQL Editor, lebih simple dan tidak ada auth issues!
