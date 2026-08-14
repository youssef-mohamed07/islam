import type { Metadata } from 'next';
import { SeerahTimeline } from '@/components/SeerahTimeline';

export const metadata: Metadata = {
  title: 'السيرة النبوية | خير سند',
  description: 'خط زمني تفاعلي لأحداث السيرة النبوية من العهد المكي إلى المدني بمصادرها المحققة.',
};

export default function SeerahPage() {
  return <SeerahTimeline />;
}
