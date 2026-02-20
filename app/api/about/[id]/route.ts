import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { aboutService } from '@/services';
import { headers } from 'next/headers';
import { z } from 'zod';

const aboutUpdateSchema = z.object({
  icon: z.string().min(1).max(10).optional(),
  title: z.string().min(2).max(255).optional(),
  content: z.string().min(1).optional(),
  order: z.number().int().optional(),
});

/**
 * PUT /api/about/[id]
 * Updates an about chapter (CMS only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateDashboardAccess();
    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.reason || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validated = aboutUpdateSchema.parse(body);

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    const about = await aboutService.update(
      id,
      validated,
      {
        ipAddress: auth.clientIp || 'unknown',
        userAgent,
      }
    );

    revalidatePath('/about');

    return NextResponse.json(about, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })) },
        { status: 400 }
      );
    }
    console.error('[API] PUT /about/[id]:', error);
    if (error instanceof Error && (error.message.includes('not found') || error.message.includes('P2025'))) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/about/[id]
 * Deletes an about chapter (CMS only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await validateDashboardAccess();
    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.reason || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    await aboutService.delete(id, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    revalidatePath('/about');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[API] DELETE /about/[id]:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
