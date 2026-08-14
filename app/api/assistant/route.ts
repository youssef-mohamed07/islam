import { NextResponse } from 'next/server';
import { findSurahByNameOrNumber, ALL_SURAHS } from '@/lib/surahsList';

export interface AssistantActionPayload {
  action: 'play_surah' | 'navigate' | 'search' | 'answer';
  tab?: string;
  url?: string;
  surahId?: number;
  surahName?: string;
  totalVerses?: number;
  ayahNumber?: number;
  searchQuery?: string;
  reply: string; // Egyptian spoken reply for TTS
  detailedAnswer?: string; // Rich answer for display
  sources?: { title: string; text?: string }[];
}

const SYSTEM_PROMPT = `أنت مساعد إسلامي شخصي ذكي وودود في موقع "خير سند".
طريقة كلامك: تتحدث بلهجة مصرية طبيعية، مهذبة، وواضحة (بدون مبالغة أو تكلف). تكون إجاباتك مفيدة ومباشرة وتناسب جميع الأعمار.
أمثلة: "أهلاً بيك، إزاي أقدر أساعدك؟"، "حاضر، هشغل لك سورة الكهف"، "القسم الخاص بمواقيت الصلاة مفتوح قدامك".

مهمتك:
1. تشغيل سور القرآن الكريم بصوت القراء.
2. التنقل في أقسام الموقع (القرآن، الحديث، الأذكار، الراديو، الفقه، السيرة، مواقيت الصلاة والقبلة، أسماء الله، التقويم، الزكاة).
3. الإجابة على الأسئلة الدينية والفقهية بطريقة سهلة ومبسطة، مع ذكر الآيات أو الأحاديث عند الحاجة.

الأقسام المتاحة ورموزها (Tabs):
- quran: القرآن الكريم والمصحف الشريف
- hadith: الحديث الشريف والسنة النبوية
- adhkar: الأذكار والأدعية اليومية
- radio: إذاعات القرآن الكريم المباشرة
- tools: مواقيت الصلاة، اتجاه القبلة، وحاسبة الزكاة
- fiqh: الفقه المقارن وأحكام المذاهب
- seerah: السيرة النبوية الشريفة
- calendar: التقويم الهجري والمناسبات
- names: أسماء الله الحسنى
- scholars: علماء وأعلام الإسلام
- tafsir: التفاسير المعتمدة
- qiraat: القراءات العشر
- account: الملف الشخصي

أنت عارف كل حاجة في موقع "خير سند" بالتفصيل، ولو حد سألك عن الموقع أو أقسامه جاوبه بدقة:
- الرئيسية: آية اليوم بتفسيرها وحديث اليوم المُحقّق وبطاقات وصول سريع لكل الأقسام.
- القرآن الكريم (/quran): المصحف كاملاً 114 سورة، تلاوة بصوت كبار المشايخ، تفسير وترجمة لكل آية، وبحث في المصحف.
- القراءات (/qiraat): القراءات العشر ورواتها مع أمثلة ونماذج تلاوة.
- التفسير (/tafsir): تفسير السعدي (تيسير الكريم الرحمن) وتفسير ابن كثير (تفسير القرآن العظيم) للآية الواحدة.
- الحديث الشريف (/hadith): 8 كتب: صحيح البخاري، صحيح مسلم، سنن أبي داود، جامع الترمذي، سنن النسائي، سنن ابن ماجه، موطأ مالك، ومسند أحمد — بتصفح الأبواب.
- الأذكار (/adhkar): حصن المسلم كاملاً بأبوابه (الصباح والمساء، النوم، السفر، الاستيقاظ، أدعية متنوعة) مع عدّاد للتسبيح.
- الفقه المقارن (/fiqh): أحكام العبادات والمعاملات على المذاهب الأربعة: الحنفي والمالكي والشافعي والحنبلي.
- السيرة (/seerah): خط زمني للسيرة النبوية من الميلاد إلى الوفاة بالغزوات والأحداث.
- الراديو (/radio): إذاعات القرآن الكريم مباشرة على مدار الساعة.
- التقويم (/calendar): التاريخ الهجري والميلادي والمناسبات الإسلامية.
- أسماء الله الحسنى (/names): الـ 99 اسماً مع الشرح والمعنى.
- العلماء (/scholars): تراجم العلماء والأعلام من الصحابة إلى المعاصرين.
- أدوات المسلم (/tools): مواقيت الصلاة حسب موقعك، اتجاه القبلة بالبوصلة، وحاسبة الزكاة.
- الزكاة والصدقة (/zakat): حاسبة زكاة المال وزكاة الفطر وأنواع الصدقة وفضلها.
- البحث الموحد: يفتّش في القرآن والحديث والتفسير والمكتبة كلها مرة واحدة.
- وأنت نفسك (المساعد الصوتي): تسمع المستخدم وتفهمه وتنفذ طلبه وتنطق الرد بصوت مصري طبيعي.

قواعد الرد (إلزامية):
0. أنت بتتكلم مع شخص حقيقي: افتكر اللي اتقال قبل كده في نفس المحادثة وابنِ ردك عليه، وخلي أسلوبك طبيعي وقريب زي صاحب بيساعد صاحبه من غير تكلف.
1. أخرج الرد بتنسيق JSON فقط، وحقل "reply" لازم يكون جملة كلامية بس من غير آيات قرآن أو اقتباسات (لأنه بيتنطق صوتياً والصوت ما يقرقاش قرآن).
{
  "action": "play_surah" | "navigate" | "search" | "answer",
  "tab": "tools",
  "surahId": 18,
  "surahName": "الكهف",
  "ayahNumber": 1,
  "searchQuery": "...",
  "reply": "جملة مصرية قصيرة وواضحة تنطق صوتياً",
  "detailedAnswer": "إجابة وافية ومريحة باللهجة المصرية مع الحفاظ على وقار المحتوى الديني",
  "sources": [{"title": "صحيح البخاري", "text": "كتاب الإيمان"}]
}

2. أمثلة للصياغة:
- تشغيل سورة: reply = "حاضر، هشغل لك سورة الكهف."
- مواقيت الصلاة: reply = "تمام، فتحت لك مواقيت الصلاة."
- سؤال ديني: أجب بلطف ووضوح بلهجة مصرية مبسطة وسليمة.`;

// Fallback Egyptian responses
function fallbackAnalyzer(text: string): AssistantActionPayload {
  const clean = text.trim();
  
  // Check for Surah Play / Quran
  const playPatterns = [
    /(?:شغل|اسمع|سمعني|اقرأ|استمع|سورة)\s+(.+)/i,
    /(?:عايز|اريد|أريد|نفسي)\s+(?:اسمع|سورة)\s+(.+)/i,
  ];

  for (const pattern of playPatterns) {
    const match = clean.match(pattern);
    if (match && match[1]) {
      const surahMeta = findSurahByNameOrNumber(match[1]);
      if (surahMeta) {
        return {
          action: 'play_surah',
          tab: 'quran',
          surahId: surahMeta.id,
          surahName: surahMeta.name,
          totalVerses: surahMeta.totalVerses,
          ayahNumber: 1,
          reply: `حاضر، ثواني وهشغل لك سورة ${surahMeta.name}.`,
          detailedAnswer: `جاري تشغيل سورة ${surahMeta.name} (عدد آياتها ${surahMeta.totalVerses} آية).`,
        };
      }
    }
  }

  // Direct Surah match
  const directSurah = findSurahByNameOrNumber(clean);
  if (directSurah) {
    return {
      action: 'play_surah',
      tab: 'quran',
      surahId: directSurah.id,
      surahName: directSurah.name,
      totalVerses: directSurah.totalVerses,
      ayahNumber: 1,
      reply: `حاضر، هشغل لك سورة ${directSurah.name}.`,
      detailedAnswer: `جاري تشغيل سورة ${directSurah.name}.`,
    };
  }

  // Navigation keywords
  if (clean.includes('صلاة') || clean.includes('مواقيت') || clean.includes('أذان') || clean.includes('عصر') || clean.includes('ظهر') || clean.includes('مغرب') || clean.includes('عشاء') || clean.includes('فجر') || clean.includes('قبلة')) {
    return {
      action: 'navigate',
      tab: 'tools',
      reply: 'تمام، فتحت لك قسم مواقيت الصلاة.',
      detailedAnswer: 'ده قسم مواقيت الصلاة، تقدر تعرف منه مواعيد الأذان واتجاه القبلة.',
    };
  }

  if (clean.includes('أذكار') || clean.includes('اذكار') || clean.includes('دعاء') || clean.includes('تسبيح') || clean.includes('صباح') || clean.includes('مساء')) {
    return {
      action: 'navigate',
      tab: 'adhkar',
      reply: 'حاضر، ده قسم الأذكار.',
      detailedAnswer: 'فتحت لك قسم الأذكار، هتلاقي فيه أذكار الصباح والمساء وحصن المسلم.',
    };
  }

  if (clean.includes('راديو') || clean.includes('اذاعة') || clean.includes('إذاعة') || clean.includes('بث')) {
    return {
      action: 'navigate',
      tab: 'radio',
      reply: 'فتحت لك إذاعة القرآن الكريم.',
      detailedAnswer: 'ده البث المباشر لإذاعة القرآن الكريم.',
    };
  }

  if (clean.includes('حديث') || clean.includes('سنة') || clean.includes('بخاري') || clean.includes('مسلم')) {
    return {
      action: 'navigate',
      tab: 'hadith',
      reply: 'تمام، ده قسم الحديث الشريف.',
      detailedAnswer: 'قسم الحديث الشريف بيحتوي على كتب السنة النبوية المعتمدة.',
    };
  }

  if (clean.includes('فقه') || clean.includes('مذهب') || clean.includes('حكم')) {
    return {
      action: 'navigate',
      tab: 'fiqh',
      reply: 'فتحت لك قسم الفقه.',
      detailedAnswer: 'تقدر تبحث هنا في أحكام الفقه والمذاهب الأربعة.',
    };
  }

  if (clean.includes('سيرة') || clean.includes('نبي') || clean.includes('رسول')) {
    return {
      action: 'navigate',
      tab: 'seerah',
      reply: 'ده قسم السيرة النبوية.',
      detailedAnswer: 'فتحت لك السيرة النبوية عشان تقرأ عن حياة النبي ﷺ.',
    };
  }

  if (clean.includes('تقويم') || clean.includes('هجري') || clean.includes('تاريخ')) {
    return {
      action: 'navigate',
      tab: 'calendar',
      reply: 'فتحت لك التقويم الهجري.',
      detailedAnswer: 'هنا التقويم الهجري والميلادي وتواريخ المناسبات الإسلامية.',
    };
  }

  if (clean.includes('أسماء الله') || clean.includes('اسماء الله') || clean.includes('الحسنى')) {
    return {
      action: 'navigate',
      tab: 'names',
      reply: 'ده قسم أسماء الله الحسنى.',
      detailedAnswer: 'القسم ده فيه أسماء الله الحسنى الـ 99 مع معانيها.',
    };
  }

  if (clean.includes('قرآن') || clean.includes('مصحف') || clean.includes('تلاوة')) {
    return {
      action: 'navigate',
      tab: 'quran',
      reply: 'تمام، فتحت لك المصحف.',
      detailedAnswer: 'قسم القرآن الكريم، تقدر تقرأ أو تسمع أي سورة.',
    };
  }

  // Default answer
  return {
    action: 'answer',
    reply: 'أهلاً بيك. إزاي أقدر أساعدك؟ ممكن تطلب سورة معينة أو تسأل في الدين.',
    detailedAnswer: 'أهلاً بيك في مساعد خير سند. أنا هنا عشان أساعدك توصل لأي حاجة في الموقع، تقدر تطلب مني تشغيل سورة أو تسألني أي سؤال ديني.',
  };
}

interface HistoryItem {
  role: 'user' | 'assistant';
  text: string;
}

export async function POST(req: Request) {
  try {
    const { text, history } = await req.json();
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'الرجاء إدخال نص صحيح' }, { status: 400 });
    }

    // ذاكرة المحادثة — آخر 6 رسائل عشان المساعد يفتكر السياق زي شخص حقيقي
    const historyMessages = Array.isArray(history)
      ? history
          .filter(
            (h): h is HistoryItem =>
              !!h && typeof h.text === 'string' && (h.role === 'user' || h.role === 'assistant')
          )
          .slice(-6)
          .map((h) => ({ role: h.role, content: h.text }))
      : [];

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      const fallback = fallbackAnalyzer(text);
      return NextResponse.json(fallback);
    }

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'Khayr Sanad Islamic AI Assistant',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o',
          temperature: 0.3,
          max_tokens: 800,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...historyMessages,
            { role: 'user', content: text },
          ],
        }),
      });

      if (!res.ok) {
        console.warn('OpenRouter API returned status:', res.status);
        const fallback = fallbackAnalyzer(text);
        return NextResponse.json(fallback);
      }

      const data = await res.json();
      const content: string = data.choices?.[0]?.message?.content ?? '';
      const cleaned = content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned) as AssistantActionPayload;

      // Enhance surah info if action is play_surah
      if (parsed.action === 'play_surah') {
        if (parsed.surahId) {
          const sMeta = ALL_SURAHS.find(s => s.id === parsed.surahId);
          if (sMeta) {
            parsed.surahName = sMeta.name;
            parsed.totalVerses = sMeta.totalVerses;
          }
        } else if (parsed.surahName) {
          const sMeta = findSurahByNameOrNumber(parsed.surahName);
          if (sMeta) {
            parsed.surahId = sMeta.id;
            parsed.surahName = sMeta.name;
            parsed.totalVerses = sMeta.totalVerses;
          }
        }
        parsed.tab = 'quran';
      }

      // Sanitize fields
      if (!parsed.reply) {
        parsed.reply = 'تحت أمرك يا فندم، تم تنفيذ طلبك.';
      }
      if (!parsed.detailedAnswer) {
        parsed.detailedAnswer = parsed.reply;
      }

      return NextResponse.json(parsed);
    } catch (llmError) {
      console.error('LLM parsing error, falling back:', llmError);
      const fallback = fallbackAnalyzer(text);
      return NextResponse.json(fallback);
    }
  } catch (err: any) {
    console.error('Assistant route unexpected error:', err);
    return NextResponse.json({ error: 'حدث خطأ في معالجة الطلب' }, { status: 500 });
  }
}
