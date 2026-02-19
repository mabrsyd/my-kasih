import { NextRequest, NextResponse } from 'next/server';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { aboutService } from '@/services';
import { headers } from 'next/headers';

/**
 * GET /api/about
 * Fetches all about chapters (public)
 */
export async function GET() {
  try {
    const chapters = await aboutService.getAll();
    return NextResponse.json(chapters, { status: 200 });
  } catch (error) {
    console.error('[API] GET /about:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/about
 * Creates a new about chapter (CMS only)
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
    const { icon, title, content, order } = body;

    if (!icon || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: icon, title, content' },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    const about = await aboutService.create(
      { icon, title, content, order: order || 0 },
      {
        ipAddress: auth.clientIp || 'unknown',
        userAgent,
      }
    );

    return NextResponse.json(about, { status: 201 });
  } catch (error) {
    console.error('[API] POST /about:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
