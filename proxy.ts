/**
 * Next.js Middleware - Proteksi Route Dashboard
 * Best Practice: Server-side auth check sebelum render halaman
 */
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;

  // Route yang dilindungi (semua /dashboard/* kecuali /dashboard/login)
  const isProtectedRoute = pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login');

  // Jika belum login dan mengakses protected route → redirect ke login
  if (isProtectedRoute && !req.auth) {
    const loginUrl = new URL('/dashboard/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login dan mengakses login page → redirect ke dashboard
  if (pathname === '/dashboard/login' && req.auth) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Terapkan middleware hanya pada route dashboard
    '/dashboard/:path*',
  ],
};
