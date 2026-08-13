import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; section: string }> }
) {
  const { collection, section } = await params;
  
  // Mapping our internal collection IDs to Fawaz Ahmed API edition names
  const editionMap: Record<string, string> = {
    'bukhari': 'ara-bukhari',
    'muslim': 'ara-muslim',
    'abudawud': 'ara-abudawud',
    'tirmidhi': 'ara-tirmidhi',
    'nasai': 'ara-nasai',
    'ibnmajah': 'ara-ibnmajah',
    'malik': 'ara-malik',
    'ahmad': 'ara-musnadahmad'
  };

  const edition = editionMap[collection];
  if (!edition) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${edition}/sections/${section}.json`, {
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch hadiths' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
