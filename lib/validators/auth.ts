import { auth } from '@/auth';
import { headers } from 'next/headers';

export interface AuthResult {
  valid: boolean;
  reason?: string;
  clientIp?: string;
}

/**
 * Validasi akses API dashboard menggunakan Auth.js session (cookie-based)
 * clientIp diambil dari request headers untuk keperluan audit log
 */
export async function validateDashboardAccess(): Promise<AuthResult> {
  const [session, headersList] = await Promise.all([auth(), headers()]);

  const clientIp =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('cf-connecting-ip') ||
    'unknown';

  if (!session || !session.user) {
    return { valid: false, reason: 'Unauthenticated', clientIp };
  }

  return { valid: true, clientIp };
}
