import { z } from 'zod';

// ============================================
// Memory Validators
// ============================================

export const memorySchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format. Expected ISO string or valid date.',
  }),
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(1, 'Description is required'),
  emoji: z.string().min(1, 'Emoji is required'),
  coverId: z.string().uuid('Invalid cover image ID'),
  publishedAt: z.string().optional().nullable().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { message: 'Invalid publishedAt format' }
  ),
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
  imageId: z.string().uuid('Invalid image ID'),
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
  imageId: z.string().uuid().optional(),
  order: z.number().int().default(0),
  published: z.boolean().default(false),
});

export const letterPartialSchema = letterSchema.partial();

export type LetterInput = z.infer<typeof letterSchema>;
export type LetterUpdateInput = z.infer<typeof letterPartialSchema>;
