import { prisma } from '@/lib/prisma';

export interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  userAgent: string;
}

export type AuditContext = Omit<AuditLogEntry, 'action' | 'entityType' | 'entityId'>;

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({ data: entry });
  } catch (error) {
    console.error('[AUDIT] Failed to log:', error);
  }
}
