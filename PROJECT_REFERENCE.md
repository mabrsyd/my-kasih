# 🗺️ Your Supabase Project - Complete Reference

## 📌 Project Information Anda

```
┌─────────────────────────────────────────────────────────────┐
│ Project ID:        jwdfnuxinqbhtoyrzzfj                     │
│ Region:            aws-1-ap-southeast-1                     │
│ Project URL:       https://jwdfnuxinqbhtoyrzzfj.supabase.co │
│ Status:            ✓ Active                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Database Credentials (Fill in)

```
PostgreSQL User:    postgres.jwdfnuxinqbhtoyrzzfj
Database:           postgres
Password:           [YOU HAVE THIS - see FINAL_SETUP_INSTRUCTIONS.md]
```

---

## 🌐 Connection Strings

### **DATABASE_URL** (for application queries)

```
postgresql://postgres.jwdfnuxinqbhtoyrzzfj:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

✓ Pooler endpoint  
✓ Port 6543  
✓ pgbouncer=true  
✓ Use for: App queries, API routes

### **DIRECT_URL** (for migrations & schema changes)

```
postgresql://postgres.jwdfnuxinqbhtoyrzzfj:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

✓ Pooler endpoint (per Supabase recommendation)  
✓ Port 5432  
✓ Use for: Prisma migrations, schema sync

---

## 🔑 API Keys

### **Project URL** (Public)

```
https://jwdfnuxinqbhtoyrzzfj.supabase.co
```

✓ Use for: Client-side Supabase initialization

### **Publishable Key** (Public - Safe to expose)

```
sb_publishable_cU55-VYvtwMGc-ZinVCaiQ_yOZvsbIR
```

✓ Use for: Frontend auth, client API calls

### **Anon Key** (Legacy - Not needed for this project)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZGZudXhpbnFiaHRveXJ6emZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0OTMwMDQsImV4cCI6MjA4NzA2OTAwNH0.fplUSlD3EcumJ6OcPgaWuMYcAf2lKbRldxAPy2wG0cw
```

---

## ✅ Configuration Status

| Config                               | Status            | Location   | Notes            |
| ------------------------------------ | ----------------- | ---------- | ---------------- |
| DATABASE_URL                         | ⏳ Needs password | .env.local | Port 6543 pooler |
| DIRECT_URL                           | ⏳ Needs password | .env.local | Port 5432 pooler |
| NEXT_PUBLIC_SUPABASE_URL             | ✓ Added           | .env.local | Already set      |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | ✓ Added           | .env.local | Already set      |

---

## 🔄 Environment Files

### **.env.local** (Your actual config - NEVER commit)

```
✓ DATABASE_URL with actual password
✓ DIRECT_URL with actual password
✓ NEXT_PUBLIC_SUPABASE_URL set
✓ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY set
⏳ Needs: [YOUR-PASSWORD] → actual DB password
```

### **.env** (Template only - rename if needed)

```
Same as .env.local but with [YOUR-PASSWORD] placeholder
This is for reference/documentation only
```

---

## 🚀 Next URL Endpoints

Once connected, these will work:

```
GET  /api/health/db          → Test database connection
GET  /api/gallery            → Fetch gallery items
GET  /api/memories           → Fetch memories
GET  /api/letters            → Fetch letters
POST /api/gallery            → Create gallery item
POST /api/memories           → Create memory
POST /api/letters            → Create letter
PUT  /api/{entity}/{id}      → Update
DELETE /api/{entity}/{id}    → Delete
```

---

## 📊 Database Schema (Configured)

Models created:

- `Media` - for images/files
- `Memory` - memories with dates & emoji
- `Gallery` - photo gallery
- `Letter` - love letters
- `AuditLog` - audit trail
- `Settings` - app settings

All with proper relations & indexes.

---

## 🔗 Important Links

| Resource           | Link                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Supabase Dashboard | https://app.supabase.co/project/jwdfnuxinqbhtoyrzzfj                                                                       |
| Database Settings  | https://app.supabase.co/project/jwdfnuxinqbhtoyrzzfj/settings/database                                                     |
| Connection Pooler  | https://app.supabase.co/project/jwdfnuxinqbhtoyrzzfj/settings/database                                                     |
| Prisma Docs        | https://www.prisma.io/docs/orm/overview/databases/postgresql                                                               |
| Next.js + Prisma   | https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgresql |

---

## 💡 Remember

✓ .env.local sudah di .gitignore  
✓ Never commit secrets to git  
✓ Password bersifat SENSITIVE  
✓ Test connection sebelum deploy  
✓ Each environment needs separate DATABASE_URL

---

**Created:** Feb 19, 2025  
**Status:** Ready for password update
