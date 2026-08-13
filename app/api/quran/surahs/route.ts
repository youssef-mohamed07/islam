import { NextResponse } from 'next/server';
import { fetchQuranSurahsFromApi } from '@/lib/dataIngestion';
import { MOCK_SURAHS } from '@/components/MockData';

export async function GET() {
  const liveSurahs = await fetchQuranSurahsFromApi();
  const surahs = (liveSurahs && liveSurahs.length > 0) ? liveSurahs : MOCK_SURAHS;

  return NextResponse.json(surahs, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
    }
  });
}
