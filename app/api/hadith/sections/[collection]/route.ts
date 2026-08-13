import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  
  const validCollections = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah', 'malik', 'ahmad'];
  
  if (!validCollections.includes(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  try {
    // Try loading local chapters data first (fast, no network)
    const chaptersPath = path.join(process.cwd(), 'public', 'data', 'hadith-chapters.json');
    const fileContents = await fs.readFile(chaptersPath, 'utf8');
    const allChapters = JSON.parse(fileContents);
    
    if (allChapters[collection]) {
      return NextResponse.json(allChapters[collection]);
    }
    
    // Fallback: return empty
    return NextResponse.json({});
  } catch (error) {
    // If local file doesn't exist yet, fallback to FawazAhmed API (English sections)
    try {
      const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/info.json`, {
        cache: 'force-cache'
      });
      
      if (res.ok) {
        const data = await res.json();
        const collectionInfo = data[collection];
        if (collectionInfo?.metadata?.sections) {
          return NextResponse.json(collectionInfo.metadata.sections);
        }
      }
    } catch (e) {
      console.error("Fallback API also failed:", e);
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
