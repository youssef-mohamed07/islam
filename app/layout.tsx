import type { Metadata, Viewport } from 'next';
import './compiled.css';
import { SITE_URL, SITE_NAME, OG_IMAGE, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    title: 'خير سند | المنصة الرقمية المحققة للمعرفة الإسلامية',
    description: 'منصة معرفية إسلامية تجمع القرآن الكريم والقراءات والتفسير والحديث والمكتبة والفقه والسيرة والأذكار في تجربة رقمية واحدة.',
    path: '/',
  }),
  keywords: ['القرآن الكريم', 'التفسير', 'الحديث الشريف', 'الفقه', 'السيرة النبوية', 'أذكار', 'مواقيت الصلاة', 'خير سند'],
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'خير سند',
  },
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  }
};

// Structured data for search engines (WebSite + Organization)
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: OG_IMAGE,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: 'ar',
      description: 'منصة معرفية إسلامية تجمع القرآن والسنة والعلم الإسلامي في مكان واحد',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDFBF7' },
    { media: '(prefers-color-scheme: dark)', color: '#0D1412' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Cairo:wght@300;400;500;600;700;800&family=Scheherazade+New:wght@400;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FDFBF7] dark:bg-[#0D1412] text-[#1A2421] dark:text-[#F5F7F6] font-arabic antialiased selection:bg-[#C5A059]/30">
        {children}
      </body>
    </html>
  );
}
