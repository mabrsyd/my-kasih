import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { aboutService } from '@/services';
import { headers } from 'next/headers';
import { z } from 'zod';

const aboutSchema = z.object({
  icon: z.string().min(1, 'Icon is required').max(10, 'Icon must be at most 10 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters').max(255),
  content: z.string().min(1, 'Content is required'),
  order: z.number().int().default(0),
});

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
    const validated = aboutSchema.parse(body);

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    const about = await aboutService.create(
      { icon: validated.icon, title: validated.title, content: validated.content, order: validated.order },
      {
        ipAddress: auth.clientIp || 'unknown',
        userAgent,
      }
    );

    revalidatePath('/about');

    return NextResponse.json(about, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })) },
        { status: 400 }
      );
    }
    console.error('[API] POST /about:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
