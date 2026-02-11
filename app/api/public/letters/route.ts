import { NextResponse } from 'next/server';
import { letterService } from '@/services';

export const revalidate = 60;

export async function GET() {
    try {
        const letters = await letterService.getAll(); // Already filters published: true
        return NextResponse.json(letters);
    } catch (error) {
        console.error('[API] GET /api/public/letters:', error);
        return NextResponse.json([], { status: 200 });
    }
}
