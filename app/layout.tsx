import type { Metadata, Viewport } from 'next';
import './compiled.css';

export const metadata: Metadata = {
  title: 'سَنَد | المنصة الرقمية المحققة للمعرفة الإسلامية',
  description: 'منصة معرفية إسلامية تجمع القرآن الكريم والقراءات والتفسير والحديث والمكتبة والفقه والسيرة والأذكار في تجربة رقمية واحدة.',
  keywords: ['القرآن الكريم', 'التفسير', 'الحديث الشريف', 'الفقه', 'السيرة النبوية', 'أذكار', 'مواقيت الصلاة', 'سند'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'سَنَد',
  },
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
      </head>
      <body className="bg-[#FDFBF7] dark:bg-[#0D1412] text-[#1A2421] dark:text-[#F5F7F6] font-arabic antialiased selection:bg-[#C5A059]/30">
        {children}
      </body>
    </html>
  );
}
