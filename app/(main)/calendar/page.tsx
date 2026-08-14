import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { HijriCalendar } from '@/components/HijriCalendar';

export const metadata: Metadata = pageMetadata({
  title: 'التقويم الهجري | خير سند',
  description: 'التاريخ الهجري اليوم والمناسبات الإسلامية والأشهر الحرم مع التقويم الميلادي المقابل.',
  path: '/calendar',
});

export default function CalendarPage() {
  return <HijriCalendar />;
}
