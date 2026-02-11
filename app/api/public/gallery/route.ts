import { NextResponse } from 'next/server';
import { galleryService } from '@/services';

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
    try {
        const gallery = await galleryService.getAll();
        return NextResponse.json(gallery);
    } catch (error) {
        console.error('[API] GET /api/public/gallery:', error);
        return NextResponse.json([], { status: 200 }); // Graceful fallback
    }
}
