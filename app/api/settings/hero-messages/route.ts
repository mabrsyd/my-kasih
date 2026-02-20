import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { settingsService } from '@/services';
import { headers } from 'next/headers';

/**
 * GET /api/settings/hero-messages
 * Fetches hero messages for home page (public)
 */
export async function GET() {
  try {
    const messages = await settingsService.getHeroMessages();
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('[API] GET /settings/hero-messages:', error);
    return NextResponse.json(
      { messages: [] },
      { status: 200 }
    );
  }
}

/**
 * POST /api/settings/hero-messages
 * Updates hero messages (CMS only)
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
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be an array of strings' },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    const setting = await settingsService.setHeroMessages(messages, {
      ipAddress: auth.clientIp || 'unknown',
      userAgent,
    });

    revalidatePath('/');

    return NextResponse.json(setting, { status: 200 });
  } catch (error) {
    console.error('[API] POST /settings/hero-messages:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
