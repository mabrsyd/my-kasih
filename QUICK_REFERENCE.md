# DATABASE_URL vs DIRECT_URL - Quick Reference Card

## The Problem

```
Error: FATAL: Tenant or user not found
```

Caused by: Both DATABASE_URL and DIRECT_URL pointing to pooler endpoint

## The Solution

```
┌─────────────────────────────────────────────────────────────┐
│ DATABASE_URL                    DIRECT_URL                  │
├─────────────────────────────────────────────────────────────┤
│ postgresql://                   postgresql://                │
│   postgres.YOUR_ID:PASSWORD@    postgres.YOUR_ID:PASSWORD@  │
│   aws-0-...pooler.              aws-0-...postgres.           │
│   supabase.com:6543/postgres    supabase.co:5432/postgres   │
│                                                             │
│ ✓ Pooler endpoint               ✓ Direct endpoint            │
│ ✓ Port 6543                     ✓ Port 5432                 │
│ ✓ pgbouncer=true                ✓ NO pooler param           │
│ ✓ For app queries               ✓ For Prisma/migrations     │
└─────────────────────────────────────────────────────────────┘
```

## Checklist Before Commit

- [ ] DATABASE_URL contains `.pooler.supabase.com:6543`
- [ ] DIRECT_URL contains `.postgres.supabase.co:5432`
- [ ] Both use SAME credentials (YOUR_ID and PASSWORD)
- [ ] No placeholder values like `qes12345wad12`
- [ ] **NEVER commit .env.local to git** (.gitignore already set)
- [ ] Test with `/api/health/db` endpoint

## Copy-Paste Template

Get from: https://app.supabase.co → Database → Connection Pooler

```dotenv
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public"
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-southeast-1.postgres.supabase.co:5432/postgres?schema=public"
```

Replace:

- `[PROJECT_ID]` = your supabase project ID (e.g., tixlsxhjzqsbbpxmajbi)
- `[PASSWORD]` = your postgres password created at project setup
- `aws-0-ap-southeast-1` = your region (may vary)

## Common Mistakes ❌

```
WRONG:
DIRECT_URL="...pooler.supabase.com:6543..."  ← POOLER! Error!
DIRECT_URL="...postgres.supabase.co:6543..." ← Wrong PORT!
DIRECT_URL="...postgressupabase.co:5432..."  ← Typo!

CORRECT:
DIRECT_URL="...postgres.supabase.co:5432..."  ← Direct + 5432
```

## Test Commands

```bash
# 1. Dev server with env loaded
npm run dev

# 2. Check connection (in another terminal)
curl http://localhost:3000/api/health/db

# 3. Test API endpoints
curl http://localhost:3000/api/gallery
curl http://localhost:3000/api/memories
curl http://localhost:3000/api/letters

# 4. Direct DB test (if psql installed)
psql "postgresql://postgres.[ID]:[PASSWORD]@aws-0-....postgres.supabase.co:5432/postgres"
```

---

**Last Updated:** Feb 19, 2025
