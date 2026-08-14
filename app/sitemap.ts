import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { HADITH_COLLECTIONS } from '@/components/hadithCollections';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    '/',
    '/quran',
    '/hadith',
    '/adhkar',
    '/qiraat',
    '/tafsir',
    '/fiqh',
    '/seerah',
    '/radio',
    '/calendar',
    '/names',
    '/scholars',
    '/tools',
    '/account',
    '/zakat',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: path === '/' ? 1 : 0.8,
  }));

  // Every surah is a deep-linkable page
  const surahRoutes = Array.from({ length: 114 }, (_, i) => ({
    url: `${SITE_URL}/quran/${i + 1}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Every hadith collection
  const hadithRoutes = HADITH_COLLECTIONS.map((c) => ({
    url: `${SITE_URL}/hadith/${c.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...surahRoutes, ...hadithRoutes];
}
