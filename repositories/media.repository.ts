import { prisma } from '@/lib/prisma';
import { Prisma, Media } from '@prisma/client';

export const mediaRepository = {
  async findAll(where?: Prisma.MediaWhereInput) {
    return prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string): Promise<Media | null> {
    return prisma.media.findUnique({ where: { id } });
  },

  async findByPath(filePath: string): Promise<Media | null> {
    return prisma.media.findUnique({ where: { filePath } });
  },

  async create(data: Prisma.MediaCreateInput): Promise<Media> {
    return prisma.media.create({ data });
  },

  async update(id: string, data: Prisma.MediaUpdateInput): Promise<Media> {
    return prisma.media.update({
      where: { id },
      data,
    });
  },

  async delete(id: string): Promise<Media> {
    return prisma.media.delete({ where: { id } });
  },

  async deleteByPath(filePath: string): Promise<Media> {
    return prisma.media.delete({ where: { filePath } });
  },

  async count(where?: Prisma.MediaWhereInput): Promise<number> {
    return prisma.media.count({ where });
  },

  async isOrphaned(mediaId: string): Promise<boolean> {
    const memory = await prisma.memory.findFirst({
      where: { coverId: mediaId },
    });
    const gallery = await prisma.gallery.findFirst({
      where: { imageId: mediaId },
    });
    const letter = await prisma.letter.findFirst({
      where: { imageId: mediaId },
    });

    return !memory && !gallery && !letter;
  },

  async deleteOrphaned(): Promise<{ count: number; deletedFiles: string[] }> {
    const allMedia = await prisma.media.findMany();
    const deletedFiles: string[] = [];
    let count = 0;

    for (const media of allMedia) {
      if (await this.isOrphaned(media.id)) {
        deletedFiles.push(media.filePath);
        await this.delete(media.id);
        count++;
      }
    }

    return { count, deletedFiles };
  },
};
