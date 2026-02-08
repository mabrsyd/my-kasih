export const SITE_NAME = 'Ennou Happy Finiarie ❤️';
export const SITE_DESCRIPTION = 'A romantic journey of love and memories';
export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const NAVIGATION_LINKS = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'About', href: '/about', id: 'about' },
  { label: 'Memories', href: '/memories', id: 'memories' },
  { label: 'Gallery', href: '/gallery', id: 'gallery' },
  { label: 'Letter', href: '/letter', id: 'letter' },
] as const;

export const MEMORIES_DATA = [
  {
    id: 1,
    date: '2023-05-15',
    title: 'Our First Meeting',
    description: 'The moment everything changed. A serendipitous encounter that sparked something magical.',
    emoji: '✨',
  },
  {
    id: 2,
    date: '2023-08-22',
    title: 'First Date',
    description: 'Coffee turned into hours of conversation. We talked until the sun set and the stars came out.',
    emoji: '☕',
  },
  {
    id: 3,
    date: '2023-12-24',
    title: 'First Christmas Together',
    description: 'Sharing warmth, laughter, and the beginning of our finest memories under the winter sky.',
    emoji: '🎄',
  },
  {
    id: 4,
    date: '2024-02-14',
    title: 'Valentine\'s Day',
    description: 'A day dedicated to celebrating the love that grows stronger with each passing moment.',
    emoji: '💕',
  },
  {
    id: 5,
    date: '2024-06-10',
    title: 'Our Adventure',
    description: 'Exploring new places together, creating unforgettable moments and inside jokes that make us laugh.',
    emoji: '🗺️',
  },
  {
    id: 6,
    date: '2024-10-03',
    title: 'One Year Anniversary',
    description: 'Celebrating 365 days of love, growth, and a partnership that feels right in every way.',
    emoji: '🎂',
  },
] as const;

export const GALLERY_PHOTOS = [
  {
    id: 1,
    title: 'Sunset Together',
    placeholder: 'bg-gradient-to-br from-soft-pink to-warm-beige',
  },
  {
    id: 2,
    title: 'Coffee Moments',
    placeholder: 'bg-gradient-to-br from-warm-beige to-pastel-red',
  },
  {
    id: 3,
    title: 'Adventure Awaits',
    placeholder: 'bg-gradient-to-br from-pastel-red to-soft-pink',
  },
  {
    id: 4,
    title: 'Laughing Together',
    placeholder: 'bg-gradient-to-br from-cream to-beige',
  },
  {
    id: 5,
    title: 'Rainy Days',
    placeholder: 'bg-gradient-to-br from-beige to-soft-pink',
  },
  {
    id: 6,
    title: 'Night Lights',
    placeholder: 'bg-gradient-to-br from-pastel-red to-warm-beige',
  },
  {
    id: 7,
    title: 'Quiet Moments',
    placeholder: 'bg-gradient-to-br from-cream to-pastel-red',
  },
  {
    id: 8,
    title: 'Forever Starts Now',
    placeholder: 'bg-gradient-to-br from-soft-pink to-beige',
  },
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

export const FOOTER_LINKS = [
  { label: 'Social', href: '#', icon: 'heart' },
  { label: 'Contact', href: '#', icon: 'envelope' },
  { label: 'Music', href: '#', icon: 'music' },
] as const;
