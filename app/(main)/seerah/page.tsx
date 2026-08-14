import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { SeerahTimeline } from '@/components/SeerahTimeline';

export const metadata: Metadata = pageMetadata({
  title: 'السيرة النبوية | خير سند',
  description: 'خط زمني تفاعلي لأحداث السيرة النبوية من العهد المكي إلى المدني بمصادرها المحققة.',
  path: '/seerah',
});

export default function SeerahPage() {
  return <SeerahTimeline />;
}
