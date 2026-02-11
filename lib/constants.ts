export const SITE_NAME = 'Ennou Happy Finiarie ❤️';
export const SITE_DESCRIPTION = 'A romantic journey of love and memories';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const NAVIGATION_LINKS = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'About', href: '/about', id: 'about' },
  { label: 'Memories', href: '/memories', id: 'memories' },
  { label: 'Gallery', href: '/gallery', id: 'gallery' },
  { label: 'Letter', href: '/letter', id: 'letter' },
] as const;

export const HERO_MESSAGES = [
  'You are my greatest adventure',
  'Every moment with you feels like home',
  'You make my heart skip a beat',
  'I fall more in love with you every day',
  'With you, I found my forever',
  'You are my favorite person',
  'Love looks good on us',
  'You are my happy place',
] as const;
