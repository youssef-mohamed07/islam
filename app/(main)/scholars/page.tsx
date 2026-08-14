import type { Metadata } from 'next';
import { ScholarsList } from '@/components/ScholarsList';

export const metadata: Metadata = {
  title: 'العلماء والتراجم | خير سند',
  description: 'تراجم أعلام العلماء والأئمة: البخاري، مسلم، ابن كثير وغيرهم مع سيرهم ومؤلفاتهم.',
};

export default function ScholarsPage() {
  return <ScholarsList />;
}
