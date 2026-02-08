import { prisma } from '@/lib/prisma';
import { Prisma, Memory, Gallery, Letter } from '@prisma/client';

// ============================================
// Memory Repository
// ============================================

export const memoryRepository = {
  async findAll(where?: Prisma.MemoryWhereInput, orderBy = { date: 'desc' as const }) {
    return prisma.memory.findMany({
      where,
      include: { cover: true },
      orderBy,
    });
  },

  async findById(id: string): Promise<(Memory & { cover: any }) | null> {
    return prisma.memory.findUnique({
      where: { id },
      include: { cover: true },
    });
  },

  async create(data: Prisma.MemoryCreateInput): Promise<Memory & { cover: any }> {
    return prisma.memory.create({
      data,
      include: { cover: true },
    });
  },

  async update(id: string, data: Prisma.MemoryUpdateInput): Promise<Memory & { cover: any }> {
    return prisma.memory.update({
      where: { id },
      data,
      include: { cover: true },
    });
  },

  async delete(id: string): Promise<Memory> {
    return prisma.memory.delete({ where: { id } });
  },

  async count(where?: Prisma.MemoryWhereInput): Promise<number> {
    return prisma.memory.count({ where });
  },
};

// ============================================
// Gallery Repository
// ============================================

export const galleryRepository = {
  async findAll(where?: Prisma.GalleryWhereInput) {
    return prisma.gallery.findMany({
      where,
      include: { image: true },
      orderBy: { order: 'asc' },
    });
  },

  async findById(id: string): Promise<(Gallery & { image: any }) | null> {
    return prisma.gallery.findUnique({
      where: { id },
      include: { image: true },
    });
  },

  async create(data: Prisma.GalleryCreateInput): Promise<Gallery & { image: any }> {
    return prisma.gallery.create({
      data,
      include: { image: true },
    });
  },

  async update(id: string, data: Prisma.GalleryUpdateInput): Promise<Gallery & { image: any }> {
    return prisma.gallery.update({
      where: { id },
      data,
      include: { image: true },
    });
  },

  async delete(id: string): Promise<Gallery> {
    return prisma.gallery.delete({ where: { id } });
  },

  async count(where?: Prisma.GalleryWhereInput): Promise<number> {
    return prisma.gallery.count({ where });
  },
};

// ============================================
// Letter Repository
// ============================================

export const letterRepository = {
  async findAll(where?: Prisma.LetterWhereInput) {
    return prisma.letter.findMany({
      where,
      include: { image: true },
      orderBy: { order: 'asc' },
    });
  },

  async findById(id: string): Promise<(Letter & { image: any }) | null> {
    return prisma.letter.findUnique({
      where: { id },
      include: { image: true },
    });
  },

  async create(data: Prisma.LetterCreateInput): Promise<Letter & { image: any }> {
    return prisma.letter.create({
      data,
      include: { image: true },
    });
  },

  async update(id: string, data: Prisma.LetterUpdateInput): Promise<Letter & { image: any }> {
    return prisma.letter.update({
      where: { id },
      data,
      include: { image: true },
    });
  },

  async delete(id: string): Promise<Letter> {
    return prisma.letter.delete({ where: { id } });
  },

  async count(where?: Prisma.LetterWhereInput): Promise<number> {
    return prisma.letter.count({ where });
  },
};
