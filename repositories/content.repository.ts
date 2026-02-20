import { prisma } from '@/lib/prisma';
import { Prisma, Memory, Gallery, Letter, About } from '@prisma/client';

/**
 * Enhanced error handling wrapper
 * Logs detailed error info for debugging
 */
function handlePrismaError(error: any, operation: string, entity: string) {
  const errorMsg = error.message || String(error);
  
  console.error(`[${entity}] ${operation} failed:`, {
    error: errorMsg,
    code: error.code,
    meta: error.meta,
    timestamp: new Date().toISOString(),
  });

  // Re-throw dengan konteks lebih jelas
  if (errorMsg.includes('FATAL')) {
    throw new Error(
      `Database connection failed (${entity}). Check DATABASE_URL and DIRECT_URL in .env.local`
    );
  }
  throw error;
}

// ============================================
// Memory Repository
// ============================================

export const memoryRepository = {
  async findAll(where?: Prisma.MemoryWhereInput, orderBy = { date: 'desc' as const }) {
    try {
      return await prisma.memory.findMany({
        where,
        include: { cover: true },
        orderBy,
      });
    } catch (error) {
      throw handlePrismaError(error, 'findAll', 'Memory');
    }
  },

  async findById(id: string): Promise<(Memory & { cover: any }) | null> {
    try {
      return await prisma.memory.findUnique({
        where: { id },
        include: { cover: true },
      });
    } catch (error) {
      throw handlePrismaError(error, `findById(${id})`, 'Memory');
    }
  },

  async create(data: Prisma.MemoryCreateInput): Promise<Memory & { cover: any }> {
    try {
      return await prisma.memory.create({
        data,
        include: { cover: true },
      });
    } catch (error) {
      throw handlePrismaError(error, 'create', 'Memory');
    }
  },

  async update(id: string, data: Prisma.MemoryUpdateInput): Promise<Memory & { cover: any }> {
    try {
      return await prisma.memory.update({
        where: { id },
        data,
        include: { cover: true },
      });
    } catch (error) {
      throw handlePrismaError(error, `update(${id})`, 'Memory');
    }
  },

  async delete(id: string): Promise<Memory> {
    try {
      return await prisma.memory.delete({ where: { id } });
    } catch (error) {
      throw handlePrismaError(error, `delete(${id})`, 'Memory');
    }
  },

  async count(where?: Prisma.MemoryWhereInput): Promise<number> {
    try {
      return await prisma.memory.count({ where });
    } catch (error) {
      throw handlePrismaError(error, 'count', 'Memory');
    }
  },
};

// ============================================
// Gallery Repository
// ============================================

export const galleryRepository = {
  async findAll(where?: Prisma.GalleryWhereInput) {
    try {
      return await prisma.gallery.findMany({
        where,
        include: { image: true },
        orderBy: { order: 'asc' },
      });
    } catch (error) {
      throw handlePrismaError(error, 'findAll', 'Gallery');
    }
  },

  async findById(id: string): Promise<(Gallery & { image: any }) | null> {
    try {
      return await prisma.gallery.findUnique({
        where: { id },
        include: { image: true },
      });
    } catch (error) {
      throw handlePrismaError(error, `findById(${id})`, 'Gallery');
    }
  },

  async create(data: Prisma.GalleryCreateInput): Promise<Gallery & { image: any }> {
    try {
      return await prisma.gallery.create({
        data,
        include: { image: true },
      });
    } catch (error) {
      throw handlePrismaError(error, 'create', 'Gallery');
    }
  },

  async update(id: string, data: Prisma.GalleryUpdateInput): Promise<Gallery & { image: any }> {
    try {
      return await prisma.gallery.update({
        where: { id },
        data,
        include: { image: true },
      });
    } catch (error) {
      throw handlePrismaError(error, `update(${id})`, 'Gallery');
    }
  },

  async delete(id: string): Promise<Gallery> {
    try {
      return await prisma.gallery.delete({ where: { id } });
    } catch (error) {
      throw handlePrismaError(error, `delete(${id})`, 'Gallery');
    }
  },

  async count(where?: Prisma.GalleryWhereInput): Promise<number> {
    try {
      return await prisma.gallery.count({ where });
    } catch (error) {
      throw handlePrismaError(error, 'count', 'Gallery');
    }
  },
};

// ============================================
// Letter Repository
// ============================================

export const letterRepository = {
  async findAll(where?: Prisma.LetterWhereInput) {
    try {
      return await prisma.letter.findMany({
        where,
        include: { image: true },
        orderBy: { order: 'asc' },
      });
    } catch (error) {
      throw handlePrismaError(error, 'findAll', 'Letter');
    }
  },

  async findById(id: string): Promise<(Letter & { image: any }) | null> {
    try {
      return await prisma.letter.findUnique({
        where: { id },
        include: { image: true },
      });
    } catch (error) {
      throw handlePrismaError(error, `findById(${id})`, 'Letter');
    }
  },

  async create(data: Prisma.LetterCreateInput): Promise<Letter & { image: any }> {
    try {
      return await prisma.letter.create({
        data,
        include: { image: true },
      });
    } catch (error) {
      throw handlePrismaError(error, 'create', 'Letter');
    }
  },

  async update(id: string, data: Prisma.LetterUpdateInput): Promise<Letter & { image: any }> {
    try {
      return await prisma.letter.update({
        where: { id },
        data,
        include: { image: true },
      });
    } catch (error) {
      throw handlePrismaError(error, `update(${id})`, 'Letter');
    }
  },

  async delete(id: string): Promise<Letter> {
    try {
      return await prisma.letter.delete({ where: { id } });
    } catch (error) {
      throw handlePrismaError(error, `delete(${id})`, 'Letter');
    }
  },

  async count(where?: Prisma.LetterWhereInput): Promise<number> {
    try {
      return await prisma.letter.count({ where });
    } catch (error) {
      throw handlePrismaError(error, 'count', 'Letter');
    }
  },
};

// ============================================
// About Repository
// ============================================

export const aboutRepository = {
  async findAll() {
    try {
      return await prisma.about.findMany({
        orderBy: { order: 'asc' },
      });
    } catch (error: any) {
      // If table doesn't exist (P2021), return empty array
      if (error?.code === 'P2021') {
        console.warn('[About] Table does not exist yet, returning empty array');
        return [];
      }
      throw handlePrismaError(error, 'findAll', 'About');
    }
  },

  async findById(id: string) {
    try {
      return await prisma.about.findUnique({ where: { id } });
    } catch (error: any) {
      if (error?.code === 'P2021') {
        console.warn('[About] Table does not exist yet');
        return null;
      }
      throw handlePrismaError(error, `findById(${id})`, 'About');
    }
  },

  async create(data: Prisma.AboutCreateInput) {
    try {
      return await prisma.about.create({ data });
    } catch (error: any) {
      if (error?.code === 'P2021') {
        throw new Error('About table not yet created. Run migrations first.');
      }
      throw handlePrismaError(error, 'create', 'About');
    }
  },

  async update(id: string, data: Prisma.AboutUpdateInput) {
    try {
      return await prisma.about.update({ where: { id }, data });
    } catch (error: any) {
      if (error?.code === 'P2021') {
        throw new Error('About table not yet created. Run migrations first.');
      }
      throw handlePrismaError(error, `update(${id})`, 'About');
    }
  },

  async delete(id: string) {
    try {
      return await prisma.about.delete({ where: { id } });
    } catch (error: any) {
      if (error?.code === 'P2021') {
        throw new Error('About table not yet created. Run migrations first.');
      }
      throw handlePrismaError(error, `delete(${id})`, 'About');
    }
  },
};

// ============================================
// Settings Repository
// ============================================

export const settingsRepository = {
  async findByKey(key: string) {
    try {
      return await prisma.settings.findUnique({ where: { key } });
    } catch (error) {
      throw handlePrismaError(error, `findByKey(${key})`, 'Settings');
    }
  },

  async findAll() {
    try {
      return await prisma.settings.findMany();
    } catch (error) {
      throw handlePrismaError(error, 'findAll', 'Settings');
    }
  },

  async upsert(key: string, value: string, description?: string) {
    try {
      return await prisma.settings.upsert({
        where: { key },
        create: { key, value, description },
        update: { value, description },
      });
    } catch (error) {
      throw handlePrismaError(error, `upsert(${key})`, 'Settings');
    }
  },

  async delete(key: string) {
    try {
      return await prisma.settings.delete({ where: { key } });
    } catch (error) {
      throw handlePrismaError(error, `delete(${key})`, 'Settings');
    }
  },
};
