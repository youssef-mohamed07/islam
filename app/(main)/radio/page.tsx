import type { Metadata } from 'next';
import { IslamicRadio } from '@/components/IslamicRadio';

export const metadata: Metadata = {
  title: 'الراديو الإسلامي | خير سند',
  description: 'بث مباشر لإذاعات القرآن الكريم والفتاوى والمحاضرات الإسلامية على مدار الساعة.',
};

export default function RadioPage() {
  return <IslamicRadio />;
}
