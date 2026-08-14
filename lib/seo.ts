import type { Metadata } from 'next';

// Production domain — override locally via NEXT_PUBLIC_SITE_URL in .env.local if needed
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.khairsanad.com';
export const SITE_NAME = 'خير سند';
export const OG_IMAGE = `${SITE_URL}/logo.jpg`;

interface PageMetaOptions {
  title: string;
  description: string;
  /** Route path, e.g. '/quran/2' — used for canonical + OG url */
  path: string;
  type?: 'website' | 'article';
}

/** Full metadata bundle for a page: title, description, canonical, OpenGraph, Twitter */
export function pageMetadata({ title, description, path, type = 'website' }: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'ar_EG',
      type,
      images: [{ url: OG_IMAGE, width: 512, height: 512, alt: title }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
