import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { AuthManager } from '@/components/AuthManager';

export const metadata: Metadata = pageMetadata({
  title: 'حسابي | خير سند',
  description: 'سجّل دخولك إلى منصة خير سند لحفظ إشاراتك المرجعية ومتابعة قراءتك.',
  path: '/account',
});

export default function AccountPage() {
  return <AuthManager />;
}
