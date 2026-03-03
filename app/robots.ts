import type { MetadataRoute } from 'next';

/**
 * robots.ts — Website ini bersifat pribadi.
 * Semua halaman di-noindex agar tidak terindeks mesin pencari.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    // Sitemap dihilangkan karena site ini private
    // sitemap: `${siteUrl}/sitemap.xml`,
  };
}
