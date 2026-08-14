import type { Metadata } from 'next';
import { HijriCalendar } from '@/components/HijriCalendar';

export const metadata: Metadata = {
  title: 'التقويم الهجري | خير سند',
  description: 'التاريخ الهجري اليوم والمناسبات الإسلامية والأشهر الحرم مع التقويم الميلادي المقابل.',
};

export default function CalendarPage() {
  return <HijriCalendar />;
}
