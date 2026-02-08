import { NextRequest, NextResponse } from 'next/server';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { letterService } from '@/services';
import { letterPartialSchema } from '@/lib/validators/content';
import { ZodError } from 'zod';
import { headers } from 'next/headers';

/**
 * GET /api/letters/[id]
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
    const letter = await letterService.getById(id);
    return NextResponse.json(letter, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Letter not found') {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      );
    }

    console.error('[API] GET /letters/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/letters/[id]
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
    const validated = letterPartialSchema.parse(body);

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const { id } = await params;

    const letter = await letterService.update(id, validated, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    return NextResponse.json(letter, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Letter not found') {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      );
    }

    console.error('[API] PATCH /letters/[id]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/letters/[id]
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

    await letterService.delete(id, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    return NextResponse.json(
      { success: true, message: 'Letter deleted' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Letter not found') {
      return NextResponse.json(
        { error: 'Letter not found' },
        { status: 404 }
      );
    }

    console.error('[API] DELETE /letters/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
