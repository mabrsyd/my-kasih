import { aboutService } from '@/services';
import AboutClient from './AboutClient';
import type { StoryChapter } from './AboutClient';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function AboutPage() {
  let chapters: StoryChapter[] = [];

  try {
    const rawChapters = await aboutService.getAll();
    chapters = rawChapters.map((c) => ({
      id: c.id,
      icon: c.icon,
      title: c.title,
      content: c.content,
      order: c.order,
    }));
  } catch (error) {
    console.error('[Page] Failed to fetch about chapters:', error);
  }

  return <AboutClient chapters={chapters} />;
}
