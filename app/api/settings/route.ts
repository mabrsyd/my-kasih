import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { settingsService } from '@/services';
import { headers } from 'next/headers';

/**
 * GET /api/settings
 * Fetches all settings
 */
export async function GET() {
  try {
    const auth = await validateDashboardAccess();
    if (!auth.valid) {
      return NextResponse.json(
        { error: auth.reason || 'Unauthorized' },
        { status: 401 }
      );
    }

    const settings = await settingsService.getAllSettings();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('[API] GET /settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/settings
 * Creates or updates a setting
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
    const { key, value, description } = body;

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Missing required fields: key, value' },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    const setting = await settingsService.setSetting(key, value, description, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    revalidatePath('/');

    return NextResponse.json(setting, { status: 200 });
  } catch (error) {
    console.error('[API] POST /settings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
