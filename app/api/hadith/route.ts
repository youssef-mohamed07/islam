import { NextResponse } from 'next/server';
import { fetchSahihBukhariFromApi } from '@/lib/dataIngestion';
import { MOCK_HADITHS } from '@/components/MockData';

export async function GET() {
  const liveHadiths = await fetchSahihBukhariFromApi();
  if (liveHadiths && liveHadiths.length > 0) {
    return NextResponse.json({
      collection: 'صحيح البخاري',
      totalCount: liveHadiths.length,
      hadiths: liveHadiths
    });
  }
  return NextResponse.json({
    collection: 'صحيح البخاري',
    totalCount: MOCK_HADITHS.length,
    hadiths: MOCK_HADITHS
  });
}
