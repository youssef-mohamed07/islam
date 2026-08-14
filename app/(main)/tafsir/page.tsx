import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { TafsirExplorer } from '@/components/TafsirExplorer';

export const metadata: Metadata = pageMetadata({
  title: 'التفسير | خير سند',
  description: 'تصفح كتب التفسير المعتمدة: تفسير ابن كثير والسعدي والطبري لفهم آيات القرآن الكريم.',
  path: '/tafsir',
});

export default function TafsirPage() {
  return <TafsirExplorer />;
}
