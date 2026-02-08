import { NextRequest, NextResponse } from 'next/server';
import { validateDashboardAccess } from '@/lib/validators/auth';
import { mediaService } from '@/services';
import { headers } from 'next/headers';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/media/upload
 * Upload media file to Supabase or local storage
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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF allowed' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    const media = await mediaService.upload(
      {
        buffer: Buffer.from(buffer),
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
      },
      {
        ipAddress: auth.clientIp || 'unknown',
        userAgent,
      }
    );

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error('[API] POST /media/upload:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload file',
      },
      { status: 500 }
    );
  }
}
