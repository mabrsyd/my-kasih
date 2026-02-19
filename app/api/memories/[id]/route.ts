import { NextRequest, NextResponse } from 'next/server';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { memoryService } from '@/services';
import { memoryPartialSchema } from '@/lib/validators/content';
import { ZodError } from 'zod';
import { headers } from 'next/headers';

/**
 * GET /api/memories/[id]
 * Fetches a single memory by ID
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
    const memory = await memoryService.getById(id);
    return NextResponse.json(memory, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Memory not found') {
      return NextResponse.json(
        { error: 'Memory not found' },
        { status: 404 }
      );
    }

    console.error('[API] GET /memories/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/memories/[id]
 * Updates a memory by ID
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
    const validated = memoryPartialSchema.parse(body);

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const { id } = await params;

    const memory = await memoryService.update(id, validated, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    return NextResponse.json(memory, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message,
          })) },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Memory not found') {
      return NextResponse.json(
        { error: 'Memory not found' },
        { status: 404 }
      );
    }

    console.error('[API] PATCH /memories/[id]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/memories/[id]
 * Deletes a memory by ID
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

    await memoryService.delete(id, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    return NextResponse.json(
      { success: true, message: 'Memory deleted' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Memory not found') {
      return NextResponse.json(
        { error: 'Memory not found' },
        { status: 404 }
      );
    }

    console.error('[API] DELETE /memories/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
