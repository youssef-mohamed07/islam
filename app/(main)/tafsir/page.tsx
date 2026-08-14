import type { Metadata } from 'next';
import { TafsirExplorer } from '@/components/TafsirExplorer';

export const metadata: Metadata = {
  title: 'التفسير | خير سند',
  description: 'تصفح كتب التفسير المعتمدة: تفسير ابن كثير والسعدي والطبري لفهم آيات القرآن الكريم.',
};

export default function TafsirPage() {
  return <TafsirExplorer />;
}
