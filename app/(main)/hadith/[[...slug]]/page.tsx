import type { Metadata } from 'next';
import { HADITH_COLLECTIONS } from '@/components/hadithCollections';
import { HadithBrowser } from '@/components/HadithBrowser';
import { pageMetadata } from '@/lib/seo';

interface HadithPageProps {
  params: Promise<{ slug?: string[] }>;
}

function parseParams(slug?: string[]) {
  const collection = slug && slug[0] && HADITH_COLLECTIONS.some((c) => c.id === slug[0]) ? slug[0] : undefined;
  const section = collection && slug![1] ? slug![1] : undefined;
  return { collection, section };
}

export async function generateMetadata({ params }: HadithPageProps): Promise<Metadata> {
  const { collection, section } = parseParams((await params).slug);
  if (!collection) {
    return pageMetadata({
      title: 'الحديث الشريف والسنة النبوية | خير سند',
      description: 'تصفح أمهات كتب الحديث المعتمدة: صحيح البخاري، صحيح مسلم، السنن والمسانيد بالسند والدليل.',
      path: '/hadith',
    });
  }
  const col = HADITH_COLLECTIONS.find((c) => c.id === collection)!;
  return pageMetadata({
    title: section
      ? `${col.name} - الباب ${section} | خير سند`
      : `${col.name} | خير سند`,
    description: section
      ? `أحاديث الباب ${section} من كتاب ${col.name} (${col.author}).`
      : `تصفح أحاديث كتاب ${col.name} (${col.author}) - ${col.total} حديثاً.`,
    path: `/hadith/${collection}${section ? `/${section}` : ''}`,
  });
}

export default async function HadithPage({ params }: HadithPageProps) {
  const { collection, section } = parseParams((await params).slug);
  return <HadithBrowser initialCollection={collection} initialSection={section} />;
}
