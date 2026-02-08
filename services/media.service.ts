import { mediaRepository } from '@/repositories';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { randomUUID } from 'crypto';

interface AuditLog {
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  userAgent: string;
}

async function logAudit(log: AuditLog) {
  try {
    await prisma.auditLog.create({
      data: log,
    });
  } catch (error) {
    console.error('[SERVICE] Failed to log audit:', error);
  }
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

export const mediaService = {
  async getAll() {
    return mediaRepository.findAll();
  },

  async getById(id: string) {
    const media = await mediaRepository.findById(id);
    if (!media) throw new Error('Media not found');
    return media;
  },

  async create(
    data: {
      fileName: string;
      filePath: string;
      publicUrl: string;
      mimeType: string;
      size: number;
      width?: number;
      height?: number;
    },
    auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>
  ) {
    const media = await mediaRepository.create(data);

    await logAudit({
      ...auditData,
      action: 'UPLOAD',
      entityType: 'Media',
      entityId: media.id,
    });

    return media;
  },

  async delete(id: string, auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>) {
    await this.getById(id); // Verify exists
    
    // Check if orphaned before deleting
    const isOrphaned = await mediaRepository.isOrphaned(id);
    if (!isOrphaned) {
      throw new Error('Cannot delete media that is being used');
    }

    await mediaRepository.delete(id);

    await logAudit({
      ...auditData,
      action: 'DELETE',
      entityType: 'Media',
      entityId: id,
    });
  },

  async upload(
    {
      buffer,
      fileName,
      mimeType,
      size,
    }: { buffer: Buffer; fileName: string; mimeType: string; size: number },
    auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>
  ) {
    try {
      // Generate unique file name
      const fileId = randomUUID();
      const ext = path.extname(fileName);
      const uniqueFileName = `${fileId}${ext}`;
      const filePath = `media/${uniqueFileName}`;

      let publicUrl: string;
      let width: number | undefined;
      let height: number | undefined;

      // Upload to Supabase if configured
      if (supabase) {
        const { data, error } = await supabase.storage
          .from('media')
          .upload(filePath, buffer, {
            contentType: mimeType,
            cacheControl: '3600',
          });

        if (error) {
          throw new Error(`Supabase upload failed: ${error.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        publicUrl = urlData.publicUrl;
      } else {
        // Fallback: Store metadata only (in production, implement local storage)
        publicUrl = `/uploads/${uniqueFileName}`;
        console.warn(
          '[SERVICE] Supabase not configured, using local storage fallback'
        );
      }

      // Extract image dimensions if it's an image
      if (mimeType.startsWith('image/')) {
        try {
          const metadata = await sharp(buffer).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch (error) {
          console.warn('[SERVICE] Failed to extract image metadata:', error);
        }
      }

      // Save metadata to database
      const media = await mediaRepository.create({
        fileName: uniqueFileName,
        filePath,
        publicUrl,
        mimeType,
        size,
        width,
        height,
      });

      await logAudit({
        ...auditData,
        action: 'UPLOAD',
        entityType: 'Media',
        entityId: media.id,
      });

      return media;
    } catch (error) {
      console.error('[SERVICE] Media upload failed:', error);
      throw error;
    }
  },

  async deleteOrphaned() {
    return mediaRepository.deleteOrphaned();
  },
};
