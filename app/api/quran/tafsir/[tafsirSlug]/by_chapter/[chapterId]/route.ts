import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tafsirSlug: string; chapterId: string }> }
) {
  const { tafsirSlug, chapterId } = await params;

  try {
    const res = await fetch(`https://api.qurancdn.com/api/v4/tafsirs/${tafsirSlug}/by_chapter/${chapterId}`, {
      next: { revalidate: 86400 }
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch tafsirs' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data.tafsirs || [], {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
