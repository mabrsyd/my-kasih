import { headers } from 'next/headers';

export const DASHBOARD_KEY = process.env.DASHBOARD_KEY || '';
export const ALLOWED_IPS = (process.env.ALLOWED_IPS || '')
  .split(',')
  .map(ip => ip.trim())
  .filter(Boolean);

export interface AuthResult {
  valid: boolean;
  reason?: string;
  clientIp?: string;
}

export async function validateDashboardAccess(): Promise<AuthResult> {
  const headersList = await headers();
  const clientIp = 
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('cf-connecting-ip') ||
    'unknown';

  // For development/demo: Allow all requests
  // In production, implement proper token validation
  if (process.env.NODE_ENV === 'development') {
    return { valid: true, clientIp };
  }

  const key = headersList.get('x-dashboard-token');

  // 1. Validate token
  if (!key || key !== DASHBOARD_KEY) {
    console.warn(`[AUTH] Invalid token attempt from ${clientIp}`);
    return { 
      valid: false, 
      reason: 'Invalid dashboard key',
      clientIp 
    };
  }

  // 2. Validate IP whitelist (if configured)
  if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
    console.warn(`[AUTH] IP ${clientIp} not whitelisted`);
    return { 
      valid: false, 
      reason: 'IP not allowed',
      clientIp 
    };
  }

  return { valid: true, clientIp };
}

export function getClientIp(headersList: Awaited<ReturnType<typeof headers>>): string {
  return (
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('cf-connecting-ip') ||
    'unknown'
  );
}
