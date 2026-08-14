import type { Metadata } from 'next';
import { MuslimTools } from '@/components/MuslimTools';

export const metadata: Metadata = {
  title: 'أدوات المسلم | خير سند',
  description: 'مواقيت الصلاة حسب موقعك، اتجاه القبلة، وحاسبة الزكاة — أدوات يومية لكل مسلم.',
};

export default function ToolsPage() {
  return <MuslimTools />;
}
