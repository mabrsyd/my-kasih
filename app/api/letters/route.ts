import { NextRequest, NextResponse } from 'next/server';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { letterService } from '@/services';
import { letterSchema } from '@/lib/validators/content';
import { ZodError } from 'zod';
import { headers } from 'next/headers';

/**
 * GET /api/letters
 * Fetches all letters
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await validateDashboardAccess();
    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.reason || 'Unauthorized' },
        { status: 401 }
      );
    }

    const letters = await letterService.getAllForDashboard();
    return NextResponse.json(letters, { status: 200 });
  } catch (error) {
    console.error('[API] GET /letters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/letters
 * Creates a new letter
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

    const body = await request.json();
    const validated = letterSchema.parse(body);

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    const letter = await letterService.create(validated, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    return NextResponse.json(letter, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('[API] POST /letters:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
