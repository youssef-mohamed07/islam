import type { Metadata } from 'next';
import { FiqhComparison } from '@/components/FiqhComparison';

export const metadata: Metadata = {
  title: 'الفقه المقارن | خير سند',
  description: 'مقارنة أحكام المذاهب الفقهية الأربعة: الحنفي والمالكي والشافعي والحنبلي مع أدلتها.',
};

export default function FiqhPage() {
  return <FiqhComparison />;
}
