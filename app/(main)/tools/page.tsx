import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { MuslimTools } from '@/components/MuslimTools';

export const metadata: Metadata = pageMetadata({
  title: 'أدوات المسلم | خير سند',
  description: 'مواقيت الصلاة حسب موقعك، اتجاه القبلة، وحاسبة الزكاة — أدوات يومية لكل مسلم.',
  path: '/tools',
});

export default function ToolsPage() {
  return <MuslimTools />;
}
