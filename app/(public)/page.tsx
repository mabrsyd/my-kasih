import { settingsService } from '@/services';
import HomeContent from './HomeContent';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
  let heroMessages: string[] = [];

  try {
    heroMessages = await settingsService.getHeroMessages();
  } catch (error) {
    console.error('[Page] Failed to fetch hero messages:', error);
  }

  return <HomeContent heroMessages={heroMessages} />;
}

