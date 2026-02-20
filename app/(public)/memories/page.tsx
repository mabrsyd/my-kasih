import { memoryService } from '@/services';
import MemoriesClient from './MemoriesClient';
import type { MemoryItem } from './MemoriesClient';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function MemoriesPage() {
  let memories: MemoryItem[] = [];

  try {
    const rawMemories = await memoryService.getAll();
    memories = rawMemories.map((m) => ({
      id: m.id,
      date: m.date instanceof Date ? m.date.toISOString() : String(m.date),
      title: m.title,
      description: m.description,
      emoji: m.emoji,
      cover: m.cover
        ? {
            publicUrl: m.cover.publicUrl,
            width: m.cover.width ?? undefined,
            height: m.cover.height ?? undefined,
          }
        : undefined,
    }));
  } catch (error) {
    console.error('[Page] Failed to fetch memories:', error);
  }

  return <MemoriesClient initialMemories={memories} />;
}
