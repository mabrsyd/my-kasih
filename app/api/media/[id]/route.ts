import { NextRequest, NextResponse } from 'next/server';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { mediaService } from '@/services';
import { headers } from 'next/headers';

/**
 * GET /api/media/[id]
 * Retrieve media metadata
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
    const media = await mediaService.getById(id);
    return NextResponse.json(media, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Media not found') {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    console.error('[API] GET /media/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/media/[id]
 * Delete media file and record
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

    await mediaService.delete(id, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    return NextResponse.json(
      { success: true, message: 'Media deleted' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Media not found') {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message.includes('in use')
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    console.error('[API] DELETE /media/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
