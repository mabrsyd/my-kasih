import { memoryRepository, galleryRepository, letterRepository, mediaRepository } from '@/repositories';
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
import { prisma } from '@/lib/prisma';

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

// ============================================
// Memory Service
// ============================================

export const memoryService = {
  async getAll() {
    return memoryRepository.findAll({ publishedAt: { not: null } });
  },

  async getAllForDashboard() {
    return memoryRepository.findAll();
  },

  async getById(id: string) {
    const memory = await memoryRepository.findById(id);
    if (!memory) throw new Error('Memory not found');
    return memory;
  },

  async create(data: MemoryInput, auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>) {
    const validated = memorySchema.parse(data);
    const memory = await memoryRepository.create({
      date: new Date(validated.date),
      title: validated.title,
      description: validated.description,
      emoji: validated.emoji,
      ...(validated.coverId && { cover: { connect: { id: validated.coverId } } }),
      publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : new Date(),
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
    auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>
  ) {
    await this.getById(id); // Verify exists
    const validated = memoryPartialSchema.parse(data);

    const updateData: any = { ...validated };
    if (validated.date) updateData.date = new Date(validated.date);
    if (validated.publishedAt) updateData.publishedAt = new Date(validated.publishedAt);

    const memory = await memoryRepository.update(id, updateData);

    await logAudit({
      ...auditData,
      action: 'UPDATE',
      entityType: 'Memory',
      entityId: id,
    });

    return memory;
  },

  async delete(id: string, auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>) {
    await this.getById(id); // Verify exists
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

  async create(data: GalleryInput, auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>) {
    const validated = gallerySchema.parse(data);

    // Verify image exists
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
    auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>
  ) {
    await this.getById(id); // Verify exists
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

  async delete(id: string, auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>) {
    await this.getById(id); // Verify exists
    await galleryRepository.delete(id);

    await logAudit({
      ...auditData,
      action: 'DELETE',
      entityType: 'Gallery',
      entityId: id,
    });
  },

  async reorder(items: Array<{ id: string; order: number }>, auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>) {
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
  async getAll() {
    return letterRepository.findAll({ published: true });
  },

  async getAllForDashboard() {
    return letterRepository.findAll();
  },

  async getById(id: string) {
    const letter = await letterRepository.findById(id);
    if (!letter) throw new Error('Letter not found');
    return letter;
  },

  async create(data: LetterInput, auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>) {
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
    auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>
  ) {
    await this.getById(id); // Verify exists
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

  async delete(id: string, auditData: Omit<AuditLog, 'action' | 'entityType' | 'entityId'>) {
    await this.getById(id); // Verify exists
    await letterRepository.delete(id);

    await logAudit({
      ...auditData,
      action: 'DELETE',
      entityType: 'Letter',
      entityId: id,
    });
  },
};
