'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Mic } from 'lucide-react';
import { useShell } from './AudioContext';

interface VoiceAssistantProps {
  /** 'header' = docked inline in the top bar (desktop); 'nav' = raised center button of the bottom nav (mobile) */
  mode?: 'header' | 'nav';
}

interface Intent {
  keys: string[];
  tab: string;
  spoken: string;
}

// Keys are stored pre-normalized (see normalizeArabic)
const INTENTS: Intent[] = [
  { keys: ['قران', 'مصحف', 'سوره', 'اقرا', 'ايا', 'ايات'], tab: 'quran', spoken: 'تم فتح القرآن الكريم' },
  { keys: ['تفسير', 'يفسر'], tab: 'tafsir', spoken: 'تم فتح التفسير' },
  { keys: ['قراءات', 'قراه', 'روايه'], tab: 'qiraat', spoken: 'تم فتح القراءات' },
  { keys: ['حديث', 'سنه', 'بخاري', 'احاديث', 'مسلم'], tab: 'hadith', spoken: 'تم فتح الحديث الشريف' },
  { keys: ['اذكار', 'ذكر', 'دعاء', 'ادعيه'], tab: 'adhkar', spoken: 'تم فتح الأذكار' },
  { keys: ['راديو', 'اذاعه', 'استمع', 'تلاوه'], tab: 'radio', spoken: 'تم فتح الراديو الإسلامي' },
  { keys: ['صلاه', 'مواقيت', 'اذان', 'وضوء', 'قبله'], tab: 'tools', spoken: 'تم فتح مواقيت الصلاة والأدوات' },
  { keys: ['زكاه', 'حاسبه'], tab: 'zakat', spoken: 'تم فتح حاسبة الزكاة' },
  { keys: ['فقه', 'مذهب', 'فتوي', 'فتاوي'], tab: 'fiqh', spoken: 'تم فتح الفقه المقارن' },
  { keys: ['سيره', 'نبي', 'الرسول', 'هجره'], tab: 'seerah', spoken: 'تم فتح السيرة النبوية' },
  { keys: ['تقويم', 'تاريخ', 'هجري'], tab: 'calendar', spoken: 'تم فتح التقويم الهجري' },
  { keys: ['اسماء', 'الحسني'], tab: 'names', spoken: 'تم فتح أسماء الله الحسنى' },
  { keys: ['علماء', 'عالم'], tab: 'scholars', spoken: 'تم فتح تراجم العلماء' },
  { keys: ['بحث', 'ابحث', 'دور', 'فتش'], tab: 'search', spoken: 'فتحت لك البحث الموحد' },
  { keys: ['رئيسيه', 'رجعني', 'الصفحه الرئيسيه'], tab: 'home', spoken: 'رجعنا للصفحة الرئيسية' },
  { keys: ['حساب', 'ملفي', 'تسجيل', 'دخول'], tab: 'account', spoken: 'تم فتح حسابك' },
];

// Warm greeting shown as a pill inside the header, next to the mic
const GREETING = 'أنا رفيقك الدائم 🙂 أخبرني بما تشاء، سأوصلك إليه وأعينك';

// Strip diacritics/tatweel and unify common Arabic letter variants so
// spoken (dialect) transcripts still match the intent keys.
const normalizeArabic = (s: string) =>
  s
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .toLowerCase()
    .trim();

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ mode = 'header' }) => {
  const router = useRouter();
  const { openSearch } = useShell();
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(true);

  // Portals need document.body — only after client mount.
  // The greeting bubble shows briefly on load, then only the compact FAB remains.
  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setGreetingVisible(false), 7000);
    return () => clearTimeout(t);
  }, []);

  const recognitionRef = useRef<any>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Voices load asynchronously — keep the list fresh
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // Pick the best-sounding Arabic voice the device offers
  const pickArabicVoice = (): SpeechSynthesisVoice | null => {
    const arabic = voicesRef.current.filter((v) => v.lang.toLowerCase().startsWith('ar'));
    if (arabic.length === 0) return null;
    const preferred = [
      (v: SpeechSynthesisVoice) => /google/i.test(v.name), // "Google العربية" (Chrome) — most natural
      (v: SpeechSynthesisVoice) => /natural|hoda|naayf|salma|shakir|laila/i.test(v.name), // Edge natural voices
      (v: SpeechSynthesisVoice) => v.lang.toLowerCase() === 'ar-eg',
      (v: SpeechSynthesisVoice) => v.lang.toLowerCase() === 'ar-sa',
    ];
    for (const test of preferred) {
      const match = arabic.find(test);
      if (match) return match;
    }
    return arabic[0];
  };

  // Speak feedback aloud — essential for elderly / low-vision users
  const speak = (text: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = pickArabicVoice();
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = 'ar-SA';
        }
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      /* silent fallback */
    }
  };

  const showFeedback = (text: string, ms = 6000) => {
    setFeedback(text);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), ms);
  };

  const handleCommand = async (raw: string) => {
    const text = normalizeArabic(raw);
    const intent = INTENTS.find((i) => i.keys.some((k) => text.includes(k)));

    // Known commands are handled instantly, even offline
    if (intent) {
      if (intent.tab === 'search') openSearch();
      else router.push(intent.tab === 'home' ? '/' : `/${intent.tab}`);
      showFeedback(intent.spoken);
      speak(intent.spoken);
      return;
    }

    // Free-form speech → let the LLM understand and guide
    showFeedback('أحلّل كلامك... لحظة من فضلك 🙂', 12000);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: raw }),
      });
      if (!res.ok) throw new Error('assistant unavailable');
      const data = await res.json();
      const reply = typeof data.reply === 'string' && data.reply ? data.reply : 'تم، تحت أمرك';

      if (data.action === 'navigate' && typeof data.url === 'string' && data.url.startsWith('/')) {
        router.push(data.url);
      } else if (data.action === 'search') {
        openSearch();
      }
      showFeedback(reply, 12000);
      speak(reply);
    } catch {
      // Guide the user with concrete examples they can try
      showFeedback(`سمعتُ: «${raw}» — يمكنك أن تقول مثلاً: افتح القرآن • أذكار اليوم • شغّل الراديو • مواقيت الصلاة`, 10000);
      speak('عذراً، لم أفهم طلبك. حاول أن تقول: افتح القرآن، أو أريد الأذكار، أو شغّل الراديو');
    }
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    // Don't let the assistant's own voice get picked up by the mic
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      showFeedback('متصفحك لا يدعم التعرف الصوتي — جرّب متصفح Chrome');
      speak('عذراً، متصفحك لا يدعم التعرف الصوتي');
      return;
    }

    const rec = new SR();
    rec.lang = 'ar-EG';
    rec.continuous = false; // auto-stops when the user finishes speaking (one tap only)
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += chunk;
        else interim += chunk;
      }
      if (final) {
        handleCommand(final);
      } else if (interim) {
        // Show every word live as the user speaks
        showFeedback(`أسمعك: «${interim}» أكمل...`, 4000);
      }
    };

    rec.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        showFeedback('يرجى السماح باستخدام الميكروفون من إعدادات المتصفح');
        speak('يرجى السماح باستخدام الميكروفون من إعدادات المتصفح');
      } else if (event.error === 'no-speech') {
        showFeedback('لم أسمع شيئاً — اضغط الميكروفون وتكلّم بوضوح');
        speak('لم أسمع شيئاً، حاول مرة أخرى');
      } else if (event.error === 'network') {
        showFeedback('التعرف الصوتي يحتاج اتصالاً بالإنترنت');
        speak('التعرف الصوتي يحتاج اتصالاً بالإنترنت');
      } else if (event.error !== 'aborted') {
        showFeedback('حدث خطأ، حاول مرة أخرى');
        speak('حدث خطأ، حاول مرة أخرى');
      }
    };

    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    try {
      rec.start();
      setIsListening(true);
      showFeedback('أنا أصغي إليك الآن... تكلّم على راحتك 🙂', 8000);
    } catch {
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch { /* noop */ }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const micButton = (size: 'sm' | 'lg') => (
    <button
      onClick={toggleListening}
      className={`relative ${size === 'lg' ? 'w-14 h-14' : 'w-11 h-11 md:w-12 md:h-12'} rounded-full flex items-center justify-center shadow-md transition-all duration-300 active:scale-95 ${
        isListening
          ? 'bg-red-500 text-white'
          : 'bg-[#0F382C] text-[#C5A059] hover:bg-[#164E3D]'
      }`}
      aria-label="المساعد الصوتي — اضغط وتكلم"
      title="اضغط وتكلم"
    >
      {isListening && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60 animate-ping" />
      )}
      <Mic className={`${size === 'lg' ? 'w-6 h-6' : 'w-5 h-5 md:w-6 md:h-6'} relative z-10`} />
    </button>
  );

  // Mobile: the raised center button of the bottom nav (chatbot slot).
  // Absolutely positioned inside MobileNav's relative container.
  if (mode === 'nav') {
    return (
      <div className="absolute left-1/2 -translate-x-1/2 -top-6">
        {(isListening || feedback || greetingVisible) && (
          <div
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-2xl shadow-xl border font-bold w-max max-w-[220px] text-center leading-relaxed text-xs ${
              isListening
                ? 'bg-white dark:bg-[#162621] text-[#0F382C] dark:text-[#F5F7F6] border-[#C5A059]/60'
                : 'bg-[#0F382C] text-white border-[#C5A059]/40'
            }`}
          >
            {feedback || (isListening ? 'أنا أصغي إليك... تكلّم على راحتك 🙂' : GREETING)}
          </div>
        )}
        <button
          onClick={toggleListening}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center border-4 border-white dark:border-[#0D1412] shadow-lg transition-all duration-300 active:scale-95 ${
            isListening
              ? 'bg-red-500 text-white'
              : 'bg-gradient-to-tr from-[#0F382C] to-[#164E3D] text-[#C5A059]'
          }`}
          aria-label="المساعد الصوتي — اضغط وتكلم"
        >
          {isListening && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60 animate-ping" />
          )}
          <Mic className="w-6 h-6 relative z-10" />
        </button>
      </div>
    );
  }

  // Desktop: docked inline inside the header bar — never covers content
  return (
    <div className="flex items-center space-x-2 space-x-reverse">
      {micButton('sm')}

      {/* Feedback panel — appears only while the assistant is active */}
      {(isListening || feedback) &&
        mounted &&
        createPortal(
          <div className="fixed top-16 md:top-24 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
            <div
              className={`px-5 py-3 rounded-2xl shadow-xl border font-bold max-w-md text-center leading-relaxed text-sm md:text-base ${
                isListening
                  ? 'bg-white dark:bg-[#162621] text-[#0F382C] dark:text-[#F5F7F6] border-[#C5A059]/60'
                  : 'bg-[#0F382C] text-white border-[#C5A059]/40'
              }`}
            >
              {feedback || 'أنا أصغي إليك... تكلّم على راحتك 🙂'}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
