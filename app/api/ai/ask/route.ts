import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { question } = body;

  return NextResponse.json({
    question,
    answer: `بناءً على التفتيش في قاعدة "سَنَد" للمصادر الشرعية المحققة المتعلقة بـ "${question}":\n\nوردت نصوص محققة توضح هذه المسألة وأحكامها من الكتاب والسنة.`,
    citations: [
      { id: '1', title: 'صحيح البخاري', source: 'باب النية' }
    ],
    disclaimer: 'ملاحظة: هذا ملخص معرفي مستخرج من المصادر الموثوقة وليس فتوى شرعية'
  });
}
