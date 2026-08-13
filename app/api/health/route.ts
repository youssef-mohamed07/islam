import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    platform: 'Sanad (سَنَد)',
    mode: 'Single Next.js App Router',
    timestamp: new Date().toISOString()
  });
}
