import type { Metadata } from 'next';
import { QiraatHub } from '@/components/QiraatHub';

export const metadata: Metadata = {
  title: 'القراءات والروايات | خير سند',
  description: 'استمع وقارن القراءات العشر المتواترة وروايات القرآن الكريم مع تراجم القراء.',
};

export default function QiraatPage() {
  return <QiraatHub />;
}
