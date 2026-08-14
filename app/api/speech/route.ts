import { NextRequest, NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('audio') as Blob;
    
    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert Blob to ArrayBuffer and then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // AssemblyAI transcriber.transcribe takes a Buffer or a URL
    const transcript = await client.transcripts.transcribe({
      audio: buffer,
      language_code: 'ar'
    });

    if (transcript.status === 'error') {
      return NextResponse.json({ error: transcript.error }, { status: 500 });
    }

    return NextResponse.json({ text: transcript.text });
  } catch (error: any) {
    console.error('AssemblyAI Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
