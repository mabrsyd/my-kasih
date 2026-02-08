import { z } from 'zod';

// ============================================
// Memory Validators
// ============================================

export const memorySchema = z.object({
  date: z.string().datetime('Invalid date format'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  emoji: z.string().emoji('Must be a valid emoji'),
  coverId: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
});

export const memoryPartialSchema = memorySchema.partial();

export type MemoryInput = z.infer<typeof memorySchema>;
export type MemoryUpdateInput = z.infer<typeof memoryPartialSchema>;

// ============================================
// Gallery Validators
// ============================================

export const gallerySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().optional(),
  imageId: z.string().cuid('Invalid image ID'),
  order: z.number().int().default(0),
});

export const galleryPartialSchema = gallerySchema.partial();

export type GalleryInput = z.infer<typeof gallerySchema>;
export type GalleryUpdateInput = z.infer<typeof galleryPartialSchema>;

// ============================================
// Letter Validators
// ============================================

export const letterSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  imageId: z.string().cuid().optional(),
  order: z.number().int().default(0),
  published: z.boolean().default(false),
});

export const letterPartialSchema = letterSchema.partial();

export type LetterInput = z.infer<typeof letterSchema>;
export type LetterUpdateInput = z.infer<typeof letterPartialSchema>;

// ============================================
// Media Validators
// ============================================

export const mediaUploadSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive('File size must be positive'),
  mimeType: z.string().startsWith('image/', 'Only image files are allowed'),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});

export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;

// File validation helper
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE || '10485760');
  const ALLOWED_TYPES = (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp')
    .split(',')
    .map(t => t.trim());

  if (file.size > MAX_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB` 
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
    };
  }

  return { valid: true };
}
