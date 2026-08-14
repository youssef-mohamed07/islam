import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ZakatCalculator } from '@/components/ZakatCalculator';

export const metadata: Metadata = pageMetadata({
  title: 'الزكاة والصدقة | خير سند',
  description:
    'احسب زكاة مالك حسب النصاب وأسعار الذهب، وزكاة فطرك بعدد أفراد أسرتك، وتعرّف على أنواع الصدقة وفضلها بأدلتها.',
  path: '/zakat',
});

export default function ZakatPage() {
  return <ZakatCalculator />;
}
