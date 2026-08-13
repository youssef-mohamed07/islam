import { NextResponse } from 'next/server';
import { fetchSahihBukhariFromApi } from '@/lib/dataIngestion';
import { MOCK_HADITHS } from '@/components/MockData';

export async function GET() {
  const liveHadiths = await fetchSahihBukhariFromApi();
  const data = (liveHadiths && liveHadiths.length > 0) ? {
    collection: 'صحيح البخاري',
    totalCount: liveHadiths.length,
    hadiths: liveHadiths
  } : {
    collection: 'صحيح البخاري',
    totalCount: MOCK_HADITHS.length,
    hadiths: MOCK_HADITHS
  };

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
    }
  });
}
