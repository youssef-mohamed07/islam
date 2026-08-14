import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { NamesOfAllah } from '@/components/NamesOfAllah';

export const metadata: Metadata = pageMetadata({
  title: 'أسماء الله الحسنى | خير سند',
  description: 'أسماء الله الحسنى التسعة والتسعون مع معانيها وفضلها وإحصائها من السنة النبوية.',
  path: '/names',
});

export default function NamesPage() {
  return <NamesOfAllah />;
}
