import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
// TTS can take several seconds for long answers
export const maxDuration = 60;

const TTS_MODEL = process.env.OPENROUTER_TTS_MODEL || 'openai/gpt-audio-mini';
const TTS_VOICE = process.env.OPENROUTER_TTS_VOICE || 'nova';
const SAMPLE_RATE = 24000; // gpt-audio outputs 24kHz mono 16-bit PCM

/** Wrap raw PCM bytes in a WAV header so browsers can play it directly */
function pcmToWav(pcm: Buffer): Buffer {
  const header = Buffer.alloc(44);
  const dataSize = pcm.length;
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate (16-bit mono)
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcm]);
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is not set' }, { status: 500 });
    }

    const cleaned = text
      .replace(/﴿[^﴾]*﴾/g, ' ')
      .replace(/«[^»]*»/g, ' ')
      .replace(/“[^”]*”/g, ' ')
      .replace(/"[^"]*"/g, ' ')
      .replace(/[*#_~`]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 2500);

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: TTS_MODEL,
        stream: true, // audio output requires streaming
        modalities: ['audio', 'text'],
        audio: { voice: TTS_VOICE, format: 'pcm16' },
        messages: [
          {
            role: 'system',
            content:
              'Repeat the user message exactly as written aloud, ONCE only, in a warm, clear, natural Egyptian Arabic voice (لهجة مصرية هادية وواضحة). Do not add, translate, repeat, or change any words.',
          },
          { role: 'user', content: cleaned },
        ],
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text();
      return NextResponse.json({ error: `TTS provider error (${res.status})`, detail }, { status: 502 });
    }

    // Consume the SSE stream and collect base64 PCM audio chunks
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const pcmParts: Buffer[] = [];
    let sseBuffer = '';

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      sseBuffer += decoder.decode(value, { stream: true });
      const lines = sseBuffer.split('\n');
      sseBuffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
          const json = JSON.parse(payload);
          const chunk: string | undefined = json?.choices?.[0]?.delta?.audio?.data;
          if (chunk) pcmParts.push(Buffer.from(chunk, 'base64'));
        } catch {
          // ignore malformed keep-alive lines
        }
      }
    }

    if (pcmParts.length === 0) {
      return NextResponse.json({ error: 'No audio returned from TTS provider' }, { status: 502 });
    }

    const wav = pcmToWav(Buffer.concat(pcmParts));
    return new NextResponse(new Uint8Array(wav), {
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('TTS error:', err);
    return NextResponse.json({ error: 'Internal TTS error' }, { status: 500 });
  }
}
