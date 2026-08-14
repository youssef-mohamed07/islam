import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { IslamicRadio } from '@/components/IslamicRadio';

export const metadata: Metadata = pageMetadata({
  title: 'الراديو الإسلامي | خير سند',
  description: 'بث مباشر لإذاعات القرآن الكريم والفتاوى والمحاضرات الإسلامية على مدار الساعة.',
  path: '/radio',
});

export default function RadioPage() {
  return <IslamicRadio />;
}
