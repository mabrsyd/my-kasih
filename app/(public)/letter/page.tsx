import { letterService } from '@/services';
import LetterClient from './LetterClient';
import type { LetterItem } from './LetterClient';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function LetterPage() {
  let letters: LetterItem[] = [];

  try {
    const rawLetters = await letterService.getAll();
    letters = rawLetters.map((l) => ({
      id: l.id,
      title: l.title,
      content: l.content,
      order: l.order,
      published: l.published,
      image: l.image ? { publicUrl: l.image.publicUrl } : null,
    }));
  } catch (error) {
    console.error('[Page] Failed to fetch letters:', error);
  }

  return <LetterClient letters={letters} />;
}

