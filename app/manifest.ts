import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.NEXT_PUBLIC_SITE_TITLE || 'My Kasih',
    short_name: 'My Kasih',
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A romantic love story',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f4ff',
    theme_color: '#7250c8',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['lifestyle', 'social'],
  };
}
