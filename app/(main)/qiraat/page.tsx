import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { QiraatHub } from '@/components/QiraatHub';

export const metadata: Metadata = pageMetadata({
  title: 'القراءات والروايات | خير سند',
  description: 'استمع وقارن القراءات العشر المتواترة وروايات القرآن الكريم مع تراجم القراء.',
  path: '/qiraat',
});

export default function QiraatPage() {
  return <QiraatHub />;
}
