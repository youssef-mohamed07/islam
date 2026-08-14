import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { HomeClient } from '@/components/HomeClient';

export const metadata: Metadata = pageMetadata({
  title: 'خير سند | المنصة الرقمية المحققة للمعرفة الإسلامية',
  description:
    'منصة معرفية إسلامية تجمع القرآن الكريم والقراءات والتفسير والحديث والمكتبة والفقه والسيرة والأذكار في تجربة رقمية واحدة.',
  path: '/',
});

export default function HomePage() {
  return <HomeClient />;
}
