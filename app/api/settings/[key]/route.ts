import { NextRequest, NextResponse } from 'next/server';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { settingsService } from '@/services';
import { headers } from 'next/headers';

/**
 * GET /api/settings/[key]
 * Fetches a specific setting
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const setting = await settingsService.getSetting(key);
    
    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    return NextResponse.json(setting, { status: 200 });
  } catch (error) {
    console.error('[API] GET /settings/[key]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings/[key]
 * Updates a specific setting
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const auth = await validateDashboardAccess();
    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.reason || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { key } = await params;
    const body = await request.json();
    const { value, description } = body;

    if (!value) {
      return NextResponse.json(
        { error: 'Missing required field: value' },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    const setting = await settingsService.setSetting(key, value, description, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    return NextResponse.json(setting, { status: 200 });
  } catch (error) {
    console.error('[API] PUT /settings/[key]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/settings/[key]
 * Deletes a specific setting
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const auth = await validateDashboardAccess();
    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.reason || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { key } = await params;

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    await settingsService.deleteSetting(key, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[API] DELETE /settings/[key]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
