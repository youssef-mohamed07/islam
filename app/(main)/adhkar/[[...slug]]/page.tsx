import type { Metadata } from 'next';
import { Adhkar } from '@/components/Adhkar';
import { pageMetadata } from '@/lib/seo';

interface AdhkarPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: AdhkarPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slug && slug[0] ? decodeURIComponent(slug[0]) : undefined;
  if (!category) {
    return pageMetadata({
      title: 'أذكار حصن المسلم | خير سند',
      description: 'أذكار وأدعية من الكتاب والسنة: أذكار الصباح والمساء والنوم والسفر وكل أبواب الذكر.',
      path: '/adhkar',
    });
  }
  return pageMetadata({
    title: `${category} | أذكار حصن المسلم`,
    description: `أذكار وأدعية باب «${category}» من كتاب حصن المسلم من أذكار الكتاب والسنة.`,
    path: `/adhkar/${encodeURIComponent(category)}`,
  });
}

export default async function AdhkarPage({ params }: AdhkarPageProps) {
  const { slug } = await params;
  const category = slug && slug[0] ? decodeURIComponent(slug[0]) : undefined;
  return <Adhkar initialCategory={category} />;
}
