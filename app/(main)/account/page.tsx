import type { Metadata } from 'next';
import { AuthManager } from '@/components/AuthManager';

export const metadata: Metadata = {
  title: 'حسابي | خير سند',
  description: 'سجّل دخولك إلى منصة خير سند لحفظ إشاراتك المرجعية ومتابعة قراءتك.',
};

export default function AccountPage() {
  return <AuthManager />;
}
