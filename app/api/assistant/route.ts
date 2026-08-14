import { NextResponse } from 'next/server';

// The assistant's "brain": understands free-form Arabic speech from elderly
// users and maps it to site navigation, search, or a short spoken answer.
const SYSTEM_PROMPT = `أنت مساعد صوتي صبور ولطيف مخصص لكبار السن في موقع إسلامي اسمه "خير سند".
مهمتك: فهم ما يقوله المستخدم (بالفصحى أو العامية المصرية) وتنفيذ طلبه.

روابط الموقع المتاحة:
- الرئيسية: /
- القرآن الكريم: /quran — سورة معينة: /quran/رقم (من 1 إلى 114، مثال: سورة يوسف = /quran/12، سورة البقرة = /quran/2، سورة الملك = /quran/67) — آية معينة: /quran/رقم-السورة/رقم-الآية (مثال: آية الكرسي = /quran/2/255)
- الحديث الشريف: /hadith — كتاب معين: /hadith/المعرف والمعرفات هي: bukhari (البخاري), muslim (مسلم), abudawud (أبو داود), tirmidhi (الترمذي), nasai (النسائي), ibnmajah (ابن ماجه), malik (موطأ مالك), ahmad (مسند أحمد)
- الأذكار: /adhkar — باب معين: /adhkar/اسم-الباب (مثال: أذكار الصباح = /adhkar/أذكار الصباح)
- التفسير: /tafsir
- القراءات: /qiraat
- الفقه المقارن: /fiqh
- السيرة النبوية: /seerah
- الراديو الإسلامي: /radio
- التقويم الهجري: /calendar
- أسماء الله الحسنى: /names
- العلماء: /scholars
- مواقيت الصلاة والقبلة والأدوات: /tools
- حاسبة الزكاة: /zakat
- الحساب: /account

قواعد صارمة:
1. رد بصيغة JSON فقط دون أي نص آخر:
   {"action": "navigate", "url": "/...", "reply": "..."} إذا كان الطلب فتح قسم أو صفحة.
   {"action": "search", "reply": "..."} إذا أراد البحث عن شيء غير محدد.
   {"action": "answer", "reply": "..."} إذا كان سؤالاً دينياً أو تحية أو كلاماً عاماً.
2. حقل reply: جملة عربية فصحى دافئة ومحترمة، قصيرة جداً (أقل من 20 كلمة)، سهلة لكبير السن، تطمئنه بما حدث أو تجيب سؤاله.
3. الأسئلة الدينية: أجب إجابة صحيحة مختصرة وميسرة، ولا تفتِ في المسائل الخلافيه بل انصحه بسؤال أهل العلم.
4. إن لم تفهم الطلب: اجعل action هو "answer" واطلب منه بلطف أن يعيد كلامه بجملة أبسط.`;

interface AssistantResponse {
  action: 'navigate' | 'search' | 'answer';
  url?: string;
  reply: string;
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string' || text.length > 500) {
      return NextResponse.json({ error: 'invalid input' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'assistant not configured' }, { status: 500 });
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'Khayr Sanad Voice Assistant',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o',
        temperature: 0,
        max_tokens: 250,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'upstream error' }, { status: 502 });
    }

    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content ?? '';
    const cleaned = content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned) as AssistantResponse;

    // Sanity checks before sending to the client
    if (!['navigate', 'search', 'answer'].includes(parsed.action)) {
      parsed.action = 'answer';
    }
    if (parsed.action === 'navigate' && (!parsed.url || !parsed.url.startsWith('/'))) {
      parsed.action = 'answer';
    }
    if (!parsed.reply || typeof parsed.reply !== 'string') {
      parsed.reply = 'تم، تحت أمرك';
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'assistant failed' }, { status: 500 });
  }
}
