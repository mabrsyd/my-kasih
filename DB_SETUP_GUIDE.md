# 🔧 Panduan Lengkap Perbaikan Prisma Database Error

## 📋 Diagnostik - Root Cause Error Anda

```
Error: FATAL: Tenant or user not found
Location: repositories/content.repository.ts (findMany calls)
```

### **Penyebab Utama:**

1. ✗ **DIRECT_URL menggunakan pooler endpoint** (error = "Tenant or user not found")
   - Pooler hanya untuk application queries, bukan direct DB access
   - Prisma butuh akses direct untuk schema introspection

2. ✗ **Credentials mungkin placeholder/tidak valid**
   - Supabase credentials di .env adalah contoh, bukan actual data

3. ✗ **Prisma Client tanpa error handling**
   - Tidak ada visibility ke connection issues

---

## ✅ FIX CHECKLIST - Ikuti secara berurutan

### **☑️ STEP 1: Dapatkan Credentials Supabase yang BENAR**

1. Buka https://app.supabase.co
2. Pilih project Anda
3. Klik **Database** (sidebar kiri)
4. Klik tombol **Connection Pooler** (biru, atas halaman)
5. Di tab **Connection String**, ada 2 URL format:

   **Untuk DATABASE_URL (pooler, app queries):**

   ```
   postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   - ✓ Host: `pooler.supabase.com`
   - ✓ Port: `6543`
   - ✓ Baris `pgbouncer=true` harus ada

   **Untuk DIRECT_URL (direct, migrations):**
   - Di halaman Connection Pooler, lihat alternativenya atau klik tab biasa

   ```
   postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.postgres.supabase.co:5432/postgres
   ```

   - ✓ Host: `postgres.supabase.co` (BUKAN pooler!)
   - ✓ Port: `5432` (standard PG, bukan 6543)
   - ✓ TANPA `pgbouncer=true`

### **☑️ STEP 2: Update .env.local dengan credentials ACTUAL**

Buka file `.env.local` dan ganti placeholder dengan credentials sebenarnya:

```dotenv
# Copy URL dari Supabase portal, replace:
# [YOUR_PROJECT_ID] = contoh: "tixlsxhjzqsbbpxmajbi"
# [YOUR_PASSWORD] = password saat create project

DATABASE_URL="postgresql://postgres.tixlsxhjzqsbbpxmajbi:YOUR_ACTUAL_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public"

DIRECT_URL="postgresql://postgres.tixlsxhjzqsbbpxmajbi:YOUR_ACTUAL_PASSWORD@aws-0-ap-southeast-1.postgres.supabase.co:5432/postgres?schema=public"
```

⚠️ **DO NOT** commit credentials to git!

- `.env.local` sudah di `.gitignore`
- `.env` hanya berisi template/placeholder

### **☑️ STEP 3: Validasi Credentials dengan Test Connection**

Jalankan test route:

```bash
# Pastikan dev server running:
npm run dev

# Di terminal lain, test connection:
curl http://localhost:3000/api/health/db
```

**Response yang benar:**

```json
{
  "status": "healthy",
  "message": "Database connection successful",
  "timestamp": "2025-02-19T..."
}
```

**Jika error:**

```json
{
  "status": "unhealthy",
  "error": "FATAL: Tenant or user not found",
  "hint": "Check DATABASE_URL and DIRECT_URL format..."
}
```

### **☑️ STEP 4: Test API Routes yang Error**

Setelah connection OK, test endpoints yang error sebelumnya:

```bash
# Test gallery endpoint
curl http://localhost:3000/api/gallery

# Test memories endpoint
curl http://localhost:3000/api/memories

# Test letters endpoint
curl http://localhost:3000/api/letters
```

Expected: Return `200` dengan data atau `[]` jika kosong

---

## 🔍 Debugging Tips

### **Jika masih error, debug langkah per langkah:**

1. **Check environment variables loaded:**

   ```bash
   # Di Next.js dev server log, harus ada output dari prisma
   npm run dev
   ```

   - Lihat console ada message dari Prisma client init

2. **Enable detailed Prisma logging:**

   Edit `lib/prisma.ts`, uncomment:

   ```typescript
   log: [
     "error",
     "warn",
     "info", // ← uncomment
     "query", // ← uncomment untuk lihat SQL
   ];
   ```

3. **Test DB credentials langsung:**

   ```bash
   # Install psql (PostgreSQL client) jika belum:
   # Windows: https://www.postgresql.org/download/windows/

   # Test connection dengan psql:
   psql "postgresql://postgres.YOUR_ID:YOUR_PASSWORD@aws-0-ap-southeast-1.postgres.supabase.co:5432/postgres"

   # Jika berhasil, akan muncul prompt: postgres=>
   # Type: \q untuk exit
   ```

4. **Check Prisma schema compatibility:**

   ```bash
   # Validate schema
   npx prisma validate

   # Generate Prisma Client
   npx prisma generate
   ```

---

## 📐 Connection Pool Explanation

```
DATABASE_URL (Pooled)
├─ Host: pooler.supabase.com:6543
├─ Backend: PgBouncer
├─ Use case: App queries, API routes
├─ Pros: Handles thousands of connections, serverless-friendly
└─ Cons: Limited to transaction-level isolation

DIRECT_URL (Direct Connection)
├─ Host: postgres.supabase.co:5432
├─ Backend: Raw PostgreSQL
├─ Use case: Migrations, schema changes, Prisma introspection
├─ Pros: Full SQL features, proper connection handling
└─ Cons: Limited connections by plan
```

**Why Prisma needs both:**

- Prisma uses DIRECT_URL untuk introspect schema saat startup
- Application queries pakai DATABASE_URL (pooled)
- If both point to pooler → error "Tenant or user not found"

---

## 🚀 Production Checklist

Jika sudah test di development, setup production:

1. **Di Vercel/hosting environment:**

   ```bash
   vercel env add DATABASE_URL
   vercel env add DIRECT_URL
   ```

2. **Atau di environment variables platform Anda**
   - Railway, Fly.io, DigitalOcean, dll
   - Paste URL dari step sebelumnya

3. **Jangan commit `.env.local` ke git!**
   ```bash
   # Check .gitignore has .env.local:
   cat .gitignore | grep env
   ```

---

## ❓ FAQ & Common Issues

### Q: "Error: P1001 Can't reach database server"

**A:** Database URL salah atau database down. Cek format & credentials di Supabase portal.

### Q: "Error: FATAL: Tenant or user not found"

**A:** DIRECT_URL menggunakan pooler. Harus menunjuk ke `.postgres.supabase.co:5432`

### Q: "Prisma Client tidak find tables"

**A:** Schema belum di-sync. Run:

```bash
npx prisma db push
# atau
npx prisma migrate dev
```

### Q: "Error ENOENT: no such file or directory, open '.env.local'"

**A:** File ada. Pastikan Next.js berjalan dari root project directory.

### Q: "Too many connections on database"

**A:** PgBouncer limit tercapai. Reduce connection count di app atau upgrade plan.

---

## 📝 Notes

- **Passwordnya secure?** Gunakan Supabase password generator
- **Multiple environments?** Pakai `.env.development.local`, `.env.production.local`
- **Sharing codebase?** Jangan commit URL, hanya `.env.example`

---

**Last Updated:** Feb 19, 2025 v1.0
