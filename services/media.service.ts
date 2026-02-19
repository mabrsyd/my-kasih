import { mediaRepository } from '@/repositories';
import { logAudit, type AuditContext } from '@/lib/audit';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;
let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Save buffer to public/uploads/ and return the public URL path.
 * Used as fallback when Supabase is not configured.
 */
function saveLocally(buffer: Buffer, uniqueFileName: string): string {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  fs.writeFileSync(path.join(uploadDir, uniqueFileName), buffer);
  return `/uploads/${uniqueFileName}`;
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
    auditData: AuditContext
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

  async delete(id: string, auditData: AuditContext) {
    const media = await this.getById(id); // Verify exists
    
    // Check if orphaned before deleting
    const isOrphaned = await mediaRepository.isOrphaned(id);
    if (!isOrphaned) {
      throw new Error('Cannot delete media that is being used');
    }

    // Delete local file if it exists
    if (media.publicUrl.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'public', media.publicUrl);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
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
    auditData: AuditContext
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
        try {
          const { data, error } = await supabase.storage
            .from('media')
            .upload(filePath, buffer, {
              contentType: mimeType,
              cacheControl: '3600',
            });

          if (error) {
            if (error.message.includes('Bucket not found')) {
              console.warn('[MEDIA] Storage bucket "media" not found — falling back to local storage');
              publicUrl = saveLocally(buffer, uniqueFileName);
            } else {
              throw new Error(`Supabase upload failed: ${error.message}`);
            }
          } else {
            // Get public URL
            const { data: urlData } = supabase.storage
              .from('media')
              .getPublicUrl(filePath);

            publicUrl = urlData.publicUrl;
          }
        } catch (uploadError: any) {
          console.error('[MEDIA] Upload error, falling back to local:', uploadError.message);
          publicUrl = saveLocally(buffer, uniqueFileName);
        }
      } else {
        console.warn('[MEDIA] Supabase not configured — saving to local storage');
        publicUrl = saveLocally(buffer, uniqueFileName);
      }

      // Extract image dimensions if it's an image
      if (mimeType.startsWith('image/')) {
        try {
          const metadata = await sharp(buffer).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch {
          // Non-critical: dimensions are optional
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
      console.error('[MEDIA] Upload failed:', error);
      throw error;
    }
  },

  async deleteOrphaned() {
    return mediaRepository.deleteOrphaned();
  },
};
