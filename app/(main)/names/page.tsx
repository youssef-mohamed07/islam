import type { Metadata } from 'next';
import { NamesOfAllah } from '@/components/NamesOfAllah';

export const metadata: Metadata = {
  title: 'أسماء الله الحسنى | خير سند',
  description: 'أسماء الله الحسنى التسعة والتسعون مع معانيها وفضلها وإحصائها من السنة النبوية.',
};

export default function NamesPage() {
  return <NamesOfAllah />;
}
