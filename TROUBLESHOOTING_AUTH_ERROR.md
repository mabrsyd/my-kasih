# 🔧 Troubleshooting - Authentication Error saat DB Push

## Issue

```
Error: P1000: Authentication failed against database server
provided database credentials for `postgres` are not valid
```

Status:

- ✅ Health check `/api/health/db` returns 200 healthy
- ✅ Database CONNECTION works
- ❌ `prisma db push` fails with auth error

## Possible Causes

1. **Password incorrect or has typo**
   - `qes12345wad12` - verify exact spelling
   - May have spaces or special chars from copy-paste

2. **Password needs to be updated**
   - Try reset database password di Supabase dashboard

3. **Migration command issue**
   - DATABASE_URL structure correct for pooler

## Solutions to Try

### Solution 1: Verify & Re-enter Password

1. Open https://app.supabase.co → Project jwdfnuxinqbhtoyrzzfj
2. Go Settings → Database
3. Look for "Database password" field
4. If can't see, scroll down atau click "Reset database password"
5. Copy exact password (watch for spaces/special chars)
6. Update .env.local

### Solution 2: Reset Database Password

1. Settings → Database
2. Scroll to "Reset database password"
3. Click button, get new password
4. Update both DATABASE_URL and DIRECT_URL with new password
5. Restart dev server

### Solution 3: Use Dashboard Studio

Instead of CLI migration, try Supabase Studio:

1. Open https://app.supabase.co → Project → Database
2. Create tables via SQL editor or tables UI
3. Tables needed: Media, Memory, Gallery, Letter, AuditLog, Settings

---

What to do next:

[ ] Option A: Verify current password
[ ] Option B: Reset password in Supabase
[ ] Option C: Manually create tables in Supabase Studio

Reply with:

1. Current password format (qes12345wad12 or something else?)
2. Or confirm you want to reset password via Supabase dashboard
