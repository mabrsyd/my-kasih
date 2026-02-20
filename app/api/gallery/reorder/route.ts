import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { galleryService } from '@/services';
import { headers } from 'next/headers';
import { z } from 'zod';

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      order: z.number().int().nonnegative(),
    })
  ),
});

/**
 * PATCH /api/gallery/reorder
 * Reorders gallery items
 */
export async function PATCH(request: NextRequest) {
  try {
    const auth = await validateDashboardAccess();
    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.reason || 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items } = reorderSchema.parse(body);

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    await galleryService.reorder(items, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    revalidatePath('/gallery');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[API] PATCH /gallery/reorder:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
