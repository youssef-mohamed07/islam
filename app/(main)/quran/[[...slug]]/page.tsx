import type { Metadata } from 'next';
import { MOCK_SURAHS } from '@/components/MockData';
import { QuranStudio } from '@/components/QuranStudio';

interface QuranPageProps {
  params: Promise<{ slug?: string[] }>;
}

function parseIds(slug?: string[]) {
  const surahId = slug && slug[0] ? parseInt(slug[0], 10) : undefined;
  const ayahId = slug && slug[1] ? parseInt(slug[1], 10) : undefined;
  return {
    surahId: surahId && surahId >= 1 && surahId <= 114 ? surahId : undefined,
    ayahId: ayahId && ayahId >= 1 ? ayahId : undefined,
  };
}

export async function generateMetadata({ params }: QuranPageProps): Promise<Metadata> {
  const { surahId, ayahId } = parseIds((await params).slug);
  if (!surahId) {
    return {
      title: 'القرآن الكريم | خير سند',
      description: 'تصفح سور القرآن الكريم كاملة مع التلاوة والتفاسير والقراءات المتواترة.',
    };
  }
  const surah = MOCK_SURAHS.find((s) => s.id === surahId);
  const name = surah ? surah.nameArabic : `رقم ${surahId}`;
  return {
    title: ayahId
      ? `سورة ${name} - الآية ${ayahId} | خير سند`
      : `سورة ${name} | خير سند`,
    description: ayahId
      ? `اقرأ الآية ${ayahId} من سورة ${name} مع التفسير والتلاوة.`
      : `اقرأ سورة ${name} كاملة مع التفسير والتلاوة والقراءات.`,
  };
}

export default async function QuranPage({ params }: QuranPageProps) {
  const { surahId, ayahId } = parseIds((await params).slug);
  return <QuranStudio initialSurahId={surahId} initialAyahId={ayahId} />;
}
