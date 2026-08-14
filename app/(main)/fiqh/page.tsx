import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { FiqhComparison } from '@/components/FiqhComparison';

export const metadata: Metadata = pageMetadata({
  title: 'الفقه المقارن | خير سند',
  description: 'مقارنة أحكام المذاهب الفقهية الأربعة: الحنفي والمالكي والشافعي والحنبلي مع أدلتها.',
  path: '/fiqh',
});

export default function FiqhPage() {
  return <FiqhComparison />;
}
