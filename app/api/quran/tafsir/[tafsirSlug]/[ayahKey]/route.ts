import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tafsirSlug: string; ayahKey: string }> }
) {
  const { tafsirSlug, ayahKey } = await params;

  try {
    const res = await fetch(`https://api.qurancdn.com/api/v4/tafsirs/${tafsirSlug}/by_ayah/${ayahKey}`, {
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch tafsir' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
