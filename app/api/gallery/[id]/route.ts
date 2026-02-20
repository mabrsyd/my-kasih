import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { galleryService } from '@/services';
import { galleryPartialSchema } from '@/lib/validators/content';
import { ZodError } from 'zod';
import { headers } from 'next/headers';

/**
 * GET /api/gallery/[id]
 */
export async function GET(
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
    const item = await galleryService.getById(id);
    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Gallery item not found') {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    console.error('[API] GET /gallery/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/gallery/[id]
 */
export async function PATCH(
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

    const body = await request.json();
    const validated = galleryPartialSchema.parse(body);

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const { id } = await params;

    const item = await galleryService.update(id, validated, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    revalidatePath('/gallery');

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Gallery item not found') {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    console.error('[API] PATCH /gallery/[id]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/gallery/[id]
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

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const { id } = await params;

    await galleryService.delete(id, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    revalidatePath('/gallery');

    return NextResponse.json(
      { success: true, message: 'Gallery item deleted' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Gallery item not found') {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    console.error('[API] DELETE /gallery/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
