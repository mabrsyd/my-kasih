import { memoryRepository, galleryRepository, letterRepository, mediaRepository, aboutRepository, settingsRepository } from '@/repositories';
import { Prisma } from '@prisma/client';
import {
  memorySchema,
  memoryPartialSchema,
  gallerySchema,
  galleryPartialSchema,
  letterSchema,
  letterPartialSchema,
  MemoryInput,
  MemoryUpdateInput,
  GalleryInput,
  GalleryUpdateInput,
  LetterInput,
  LetterUpdateInput,
} from '@/lib/validators/content';
import { logAudit, type AuditContext } from '@/lib/audit';

// ============================================
// Memory Service
// ============================================

export const memoryService = {
  /**
   * Get memories - with optional published filter
   * @param published - if true, only return published; if false, return all (for CMS); if undefined, return published only
   */
  async getAll(published?: boolean) {
    const where = published === undefined 
      ? { publishedAt: { not: null } }  // Default: public behavior (published only)
      : published === false
      ? {}  // CMS: all items including drafts
      : { publishedAt: { not: null } };  // Explicit published=true
    
    return memoryRepository.findAll(where);
  },

  async getById(id: string) {
    const memory = await memoryRepository.findById(id);
    if (!memory) throw new Error('Memory not found');
    return memory;
  },

  async create(data: MemoryInput, auditData: AuditContext) {
    const validated = memorySchema.parse(data);
    const memory = await memoryRepository.create({
      date: new Date(validated.date),
      title: validated.title,
      description: validated.description,
      emoji: validated.emoji,
      cover: { connect: { id: validated.coverId } },
      // Default to draft (null); only publish if publishedAt is explicitly provided
      publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null,
    });

    await logAudit({
      ...auditData,
      action: 'CREATE',
      entityType: 'Memory',
      entityId: memory.id,
    });

    return memory;
  },

  async update(
    id: string,
    data: MemoryUpdateInput,
    auditData: AuditContext
  ) {
    await this.getById(id);
    const validated = memoryPartialSchema.parse(data);

    // Build Prisma update input explicitly to avoid raw scalar FK issues
    const updateData: Prisma.MemoryUpdateInput = {};
    if (validated.date !== undefined) updateData.date = new Date(validated.date);
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.emoji !== undefined) updateData.emoji = validated.emoji;
    // Use Prisma relation connect (same pattern as galleryService & letterService)
    if (validated.coverId !== undefined) updateData.cover = { connect: { id: validated.coverId } };
    // Explicitly handle null to allow unpublishing (if (truthy) would skip null)
    if (validated.publishedAt !== undefined) {
      updateData.publishedAt = validated.publishedAt ? new Date(validated.publishedAt) : null;
    }

    const memory = await memoryRepository.update(id, updateData);

    await logAudit({
      ...auditData,
      action: 'UPDATE',
      entityType: 'Memory',
      entityId: id,
    });

    return memory;
  },

  async delete(id: string, auditData: AuditContext) {
    await this.getById(id);
    await memoryRepository.delete(id);

    await logAudit({
      ...auditData,
      action: 'DELETE',
      entityType: 'Memory',
      entityId: id,
    });
  },
};

// ============================================
// Gallery Service
// ============================================

export const galleryService = {
  async getAll() {
    return galleryRepository.findAll();
  },

  async getById(id: string) {
    const gallery = await galleryRepository.findById(id);
    if (!gallery) throw new Error('Gallery item not found');
    return gallery;
  },

  async create(data: GalleryInput, auditData: AuditContext) {
    const validated = gallerySchema.parse(data);

    const image = await mediaRepository.findById(validated.imageId);
    if (!image) throw new Error('Image not found');

    const gallery = await galleryRepository.create({
      title: validated.title,
      description: validated.description,
      order: validated.order,
      image: { connect: { id: validated.imageId } },
    });

    await logAudit({
      ...auditData,
      action: 'CREATE',
      entityType: 'Gallery',
      entityId: gallery.id,
    });

    return gallery;
  },

  async update(
    id: string,
    data: GalleryUpdateInput,
    auditData: AuditContext
  ) {
    await this.getById(id);
    const validated = galleryPartialSchema.parse(data);

    if (validated.imageId) {
      const image = await mediaRepository.findById(validated.imageId);
      if (!image) throw new Error('Image not found');
    }

    const gallery = await galleryRepository.update(id, {
      title: validated.title,
      description: validated.description,
      order: validated.order,
      image: validated.imageId ? { connect: { id: validated.imageId } } : undefined,
    });

    await logAudit({
      ...auditData,
      action: 'UPDATE',
      entityType: 'Gallery',
      entityId: id,
    });

    return gallery;
  },

  async delete(id: string, auditData: AuditContext) {
    await this.getById(id);
    await galleryRepository.delete(id);

    await logAudit({
      ...auditData,
      action: 'DELETE',
      entityType: 'Gallery',
      entityId: id,
    });
  },

  async reorder(items: Array<{ id: string; order: number }>, auditData: AuditContext) {
    await Promise.all(
      items.map(item =>
        galleryRepository.update(item.id, { order: item.order })
      )
    );

    await logAudit({
      ...auditData,
      action: 'UPDATE',
      entityType: 'Gallery',
      entityId: 'batch',
    });
  },
};

// ============================================
// Letter Service
// ============================================

export const letterService = {
  /**
   * Get letters - with optional published filter
   * @param published - if true, only return published; if false, return all (for CMS); if undefined, return published only
   */
  async getAll(published?: boolean) {
    const where = published === undefined
      ? { published: true }  // Default: public behavior (published only)
      : published === false
      ? {}  // CMS: all items including drafts
      : { published: true };  // Explicit published=true
    
    return letterRepository.findAll(where);
  },

  async getById(id: string) {
    const letter = await letterRepository.findById(id);
    if (!letter) throw new Error('Letter not found');
    return letter;
  },

  async create(data: LetterInput, auditData: AuditContext) {
    const validated = letterSchema.parse(data);

    if (validated.imageId) {
      const image = await mediaRepository.findById(validated.imageId);
      if (!image) throw new Error('Image not found');
    }

    const letter = await letterRepository.create({
      title: validated.title,
      content: validated.content,
      order: validated.order,
      published: validated.published,
      image: validated.imageId ? { connect: { id: validated.imageId } } : undefined,
    });

    await logAudit({
      ...auditData,
      action: 'CREATE',
      entityType: 'Letter',
      entityId: letter.id,
    });

    return letter;
  },

  async update(
    id: string,
    data: LetterUpdateInput,
    auditData: AuditContext
  ) {
    await this.getById(id);
    const validated = letterPartialSchema.parse(data);

    if (validated.imageId) {
      const image = await mediaRepository.findById(validated.imageId);
      if (!image) throw new Error('Image not found');
    }

    const letter = await letterRepository.update(id, {
      title: validated.title,
      content: validated.content,
      order: validated.order,
      published: validated.published,
      image: validated.imageId ? { connect: { id: validated.imageId } } : undefined,
    });

    await logAudit({
      ...auditData,
      action: 'UPDATE',
      entityType: 'Letter',
      entityId: id,
    });

    return letter;
  },

  async delete(id: string, auditData: AuditContext) {
    await this.getById(id);
    await letterRepository.delete(id);

    await logAudit({
      ...auditData,
      action: 'DELETE',
      entityType: 'Letter',
      entityId: id,
    });
  },

  async reorder(items: Array<{ id: string; order: number }>, auditData: AuditContext) {
    await Promise.all(
      items.map(item =>
        letterRepository.update(item.id, { order: item.order })
      )
    );

    await logAudit({
      ...auditData,
      action: 'UPDATE',
      entityType: 'Letter',
      entityId: 'batch',
    });
  },
};

// ============================================
// About Service
// ============================================

export const aboutService = {
  async getAll() {
    return aboutRepository.findAll();
  },

  async create(data: { icon: string; title: string; content: string; order?: number }, auditData: AuditContext) {
    const about = await aboutRepository.create(data);

    await logAudit({
      ...auditData,
      action: 'CREATE',
      entityType: 'About',
      entityId: about.id,
    });

    return about;
  },

  async update(id: string, data: { icon?: string; title?: string; content?: string; order?: number }, auditData: AuditContext) {
    const about = await aboutRepository.update(id, data);

    await logAudit({
      ...auditData,
      action: 'UPDATE',
      entityType: 'About',
      entityId: id,
    });

    return about;
  },

  async delete(id: string, auditData: AuditContext) {
    await aboutRepository.delete(id);

    await logAudit({
      ...auditData,
      action: 'DELETE',
      entityType: 'About',
      entityId: id,
    });
  },
};

// ============================================
// Settings Service
// ============================================

export const settingsService = {
  async getHeroMessages(): Promise<string[]> {
    try {
      const setting = await settingsRepository.findByKey('HERO_MESSAGES');
      if (!setting) return [];
      return JSON.parse(setting.value);
    } catch {
      return [];
    }
  },

  async setHeroMessages(messages: string[], auditData: AuditContext) {
    const setting = await settingsRepository.upsert(
      'HERO_MESSAGES',
      JSON.stringify(messages),
      'Random hero messages displayed on home page'
    );

    await logAudit({
      ...auditData,
      action: 'UPDATE',
      entityType: 'Settings',
      entityId: 'HERO_MESSAGES',
    });

    return setting;
  },

  async getSetting(key: string) {
    return settingsRepository.findByKey(key);
  },

  async setSetting(key: string, value: string, description: string | undefined, auditData: AuditContext) {
    const setting = await settingsRepository.upsert(key, value, description);

    await logAudit({
      ...auditData,
      action: 'UPDATE',
      entityType: 'Settings',
      entityId: key,
    });

    return setting;
  },

  async getAllSettings() {
    return settingsRepository.findAll();
  },

  async deleteSetting(key: string, auditData: AuditContext) {
    await settingsRepository.delete(key);

    await logAudit({
      ...auditData,
      action: 'DELETE',
      entityType: 'Settings',
      entityId: key,
    });
  },
};
