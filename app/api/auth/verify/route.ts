import { NextRequest, NextResponse } from 'next/server';
import { validateDashboardAccess } from '@/lib/validators/auth';

/**
 * POST /api/auth/verify
 * Verifies the dashboard access token
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await validateDashboardAccess();

    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.reason || 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Dashboard access verified' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] POST /auth/verify:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
