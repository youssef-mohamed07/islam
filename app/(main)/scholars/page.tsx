import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ScholarsList } from '@/components/ScholarsList';

export const metadata: Metadata = pageMetadata({
  title: 'العلماء والتراجم | خير سند',
  description: 'تراجم أعلام العلماء والأئمة: البخاري، مسلم، ابن كثير وغيرهم مع سيرهم ومؤلفاتهم.',
  path: '/scholars',
});

export default function ScholarsPage() {
  return <ScholarsList />;
}
