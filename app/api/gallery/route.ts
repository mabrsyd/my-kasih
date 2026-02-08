import { NextRequest, NextResponse } from 'next/server';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { galleryService } from '@/services';
import { gallerySchema } from '@/lib/validators/content';
import { ZodError } from 'zod';
import { headers } from 'next/headers';

/**
 * GET /api/gallery
 * Fetches all gallery items
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

    const items = await galleryService.getAll();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('[API] GET /gallery:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/gallery
 * Creates a new gallery item
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
    const validated = gallerySchema.parse(body);

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    const item = await galleryService.create(validated, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('[API] POST /gallery:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
