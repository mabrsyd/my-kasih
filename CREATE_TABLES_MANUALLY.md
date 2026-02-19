# ✅ SOLUSI - Create Tables via Supabase SQL Editor

Karena `prisma db push` memiliki issue dengan connection strings, kita buat tables secara manual via Supabase UI.

---

## 📋 Langkah-langkah:

### Step 1: Buka Supabase SQL Editor

```
1. Buka https://app.supabase.co
2. Klik project "my_kasih" / "jwdfnuxinqbhtoyrzzfj"
3. Di sidebar kiri, klik "SQL Editor"
4. Klik tombol "New Query" (tombol biru + atas)
```

### Step 2: Copy SQL Schema

Salin semua SQL di bawah ke SQL Editor Supabase:

```sql
-- Create Media table
CREATE TABLE "public"."Media" (
  "id" text NOT NULL PRIMARY KEY,
  "fileName" varchar(255) NOT NULL,
  "filePath" text NOT NULL UNIQUE,
  "publicUrl" text NOT NULL,
  "mimeType" varchar(100) NOT NULL,
  "size" integer NOT NULL,
  "width" integer,
  "height" integer,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Memory table
CREATE TABLE "public"."Memory" (
  "id" text NOT NULL PRIMARY KEY,
  "date" timestamp(3) NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" text NOT NULL,
  "emoji" varchar(10) NOT NULL,
  "coverId" text REFERENCES "public"."Media"("id") ON DELETE SET NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "publishedAt" timestamp(3)
);

-- Create Gallery table
CREATE TABLE "public"."Gallery" (
  "id" text NOT NULL PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "description" text,
  "order" integer NOT NULL DEFAULT 0,
  "imageId" text NOT NULL UNIQUE REFERENCES "public"."Media"("id") ON DELETE CASCADE,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Letter table
CREATE TABLE "public"."Letter" (
  "id" text NOT NULL PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "content" text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  "published" boolean NOT NULL DEFAULT false,
  "imageId" text REFERENCES "public"."Media"("id") ON DELETE SET NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create AuditLog table
CREATE TABLE "public"."AuditLog" (
  "id" text NOT NULL PRIMARY KEY,
  "action" varchar(50) NOT NULL,
  "entityType" varchar(50) NOT NULL,
  "entityId" varchar(100) NOT NULL,
  "changes" jsonb,
  "ipAddress" varchar(45) NOT NULL,
  "userAgent" text NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Settings table
CREATE TABLE "public"."Settings" (
  "key" varchar(100) NOT NULL PRIMARY KEY,
  "value" text NOT NULL,
  "description" text,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
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

### Step 3: Run SQL Query

```
1. Paste SQL di atas ke editor Supabase
2. Klik tombol "Run" (atau Ctrl+Enter)
3. Tunggu sampai selesai, harus ada success message
```

### Step 4: Regenerate Prisma Client

```bash
cd d:\project\my-kasih
npx prisma generate
```

### Step 5: Start Dev Server

```bash
npm run dev
```

### Step 6: Test Endpoints

```bash
# Di browser atau terminal baru:
curl http://localhost:3000/api/gallery
curl http://localhost:3000/api/memories
curl http://localhost:3000/api/letters
```

**Expected:** 200 OK dengan `[]` (empty arrays)

---

## ✅ After Tables Created

All endpoints akan bekerja:

- ✅ `/api/health/db` - status healthy
- ✅ `/api/gallery` - return empty array
- ✅ `/api/memories` - return empty array
- ✅ `/api/letters` - return empty array
- ✅ Dashboard create/edit/delete akan working

---

## 📝 Connection Strings (Confirmed Working)

```
DATABASE_URL (for app queries):
postgresql://postgres.jwdfnuxinqbhtoyrzzfj:qes12345wad12@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

DIRECT_URL (backup if needed):
postgresql://postgres:qes12345wad12@db.jwdfnuxinqbhtoyrzzfj.supabase.co:5432/postgres
```

---

Lakukan sekarang via Supabase SQL Editor, lebih cepat dan reliable! 🚀
