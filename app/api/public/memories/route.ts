import { NextResponse } from 'next/server';
import { memoryService } from '@/services';

export const revalidate = 60;

export async function GET() {
    try {
        const memories = await memoryService.getAll(); // Already filters publishedAt != null
        return NextResponse.json(memories);
    } catch (error) {
        console.error('[API] GET /api/public/memories:', error);
        return NextResponse.json([], { status: 200 });
    }
}
