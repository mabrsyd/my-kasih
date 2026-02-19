import { validateDatabaseConnection } from '@/lib/prisma';

/**
 * API Route to validate database connection
 * GET /api/health/db
 */
export async function GET() {
  try {
    await validateDatabaseConnection();
    
    return Response.json({
      status: 'healthy',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[DB Health Check Failed]', error);

    return Response.json(
      {
        status: 'unhealthy',
        message: 'Database connection failed',
        error: error.message || 'Unknown error',
        hint: `
Check the following:
1. DATABASE_URL dan DIRECT_URL di .env.local
2. DIRECT_URL harus menunjuk ke .postgres.supabase.co (bukan .pooler.supabase.com)
3. PORT untuk DIRECT_URL adalah 5432
4. Credentials username:password benar
5. Database user memiliki permissions yang tepat
        `.trim(),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
