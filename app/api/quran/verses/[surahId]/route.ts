import { NextRequest, NextResponse } from 'next/server';
import { fetchQuranVersesFromApi } from '@/lib/dataIngestion';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surahId: string }> }
) {
  const { surahId: surahIdParam } = await params;
  const surahId = parseInt(surahIdParam, 10);
  
  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return NextResponse.json({ error: 'Invalid Surah ID' }, { status: 400 });
  }

  const verses = await fetchQuranVersesFromApi(surahId);

  return NextResponse.json(verses, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
    }
  });
}
