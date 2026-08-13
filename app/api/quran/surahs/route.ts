import { NextResponse } from 'next/server';
import { fetchQuranSurahsFromApi } from '@/lib/dataIngestion';
import { MOCK_SURAHS } from '@/components/MockData';

export async function GET() {
  const liveSurahs = await fetchQuranSurahsFromApi();
  if (liveSurahs && liveSurahs.length > 0) {
    return NextResponse.json(liveSurahs);
  }
  return NextResponse.json(MOCK_SURAHS);
}
