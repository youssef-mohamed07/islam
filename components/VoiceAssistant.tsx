'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, 
  Loader2, 
  Square, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  Play, 
  ArrowLeft, 
  Send, 
  RotateCcw,
  MessageCircle,
  Minimize2,
  CheckCircle2,
  Headphones
} from 'lucide-react';
import { useShell } from './AudioContext';
import { AssistantActionPayload } from '@/app/api/assistant/route';

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  payload?: AssistantActionPayload;
  timestamp: Date;
}

export const VoiceAssistant: React.FC = () => {
  const router = useRouter();
  const { playAudio, openSearch } = useShell();

  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const ttsDoneRef = useRef<(() => void) | null>(null);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');
  const recordingActiveRef = useRef(false);
  const sentRef = useRef(false);
  const heardAnythingRef = useRef(false);
  const lastResultAtRef = useRef(0);
  const silenceWatcherRef = useRef<NodeJS.Timeout | null>(null);

  // Avoid SSR/CSR mismatch for the fixed overlay
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isProcessing]);

  // Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Best Arabic Voice Picker — voices load asynchronously, so we cache and wait for them
  const voicesCacheRef = useRef<SpeechSynthesisVoice[]>([]);

  const loadVoices = useCallback((): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const existing = synth.getVoices();
      if (existing.length > 0) {
        voicesCacheRef.current = existing;
        resolve(existing);
        return;
      }
      let settled = false;
      const finish = () => {
        if (settled) return;
        const v = synth.getVoices();
        if (v.length > 0) {
          settled = true;
          voicesCacheRef.current = v;
          synth.removeEventListener('voiceschanged', finish);
          resolve(v);
        }
      };
      synth.addEventListener('voiceschanged', finish);
      // بعض المتصفحات لا تطلق الحدث بشكل موثوق — إعادة محاولة
      setTimeout(finish, 300);
      setTimeout(finish, 1000);
      setTimeout(() => {
        if (!settled) {
          settled = true;
          synth.removeEventListener('voiceschanged', finish);
          resolve(synth.getVoices());
        }
      }, 2500);
    });
  }, []);

  const pickArabicVoice = (voices: SpeechSynthesisVoice[]) => {
    const arabic = voices.filter((v) => v.lang.toLowerCase().startsWith('ar'));
    if (arabic.length === 0) return undefined;
    return (
      arabic.find((v) => v.name.includes('Google')) ||
      arabic.find((v) => /natural|neural/i.test(v.name)) ||
      arabic.find((v) =>
        ['Hoda', 'Salma', 'Hamed', 'Naayf', 'Laila', 'Tarik', 'Maged', 'Shakir', 'Amal'].some((n) => v.name.includes(n))
      ) ||
      arabic.find((v) => v.lang === 'ar-EG' || v.lang === 'ar_EG') ||
      arabic.find((v) => v.lang === 'ar-SA') ||
      arabic[0]
    );
  };

  // Preload voices as soon as the component mounts so the first reply speaks correctly
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      loadVoices();
    }
  }, [loadVoices]);

  // تنظيف النص المنطوق: لا نُنطق آيات قرآن أو اقتباسات مقدسة إطلاقاً
  const cleanSpokenText = (text: string) =>
    text
      .replace(/﴿[^﴾]*﴾/g, ' ')
      .replace(/«[^»]*»/g, ' ')
      .replace(/“[^”]*”/g, ' ')
      .replace(/"[^"]*"/g, ' ')
      .replace(/[*#_~`]/g, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

  const browserSpeak = useCallback((text: string): Promise<void> => {
    return new Promise(async (resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve();
      window.speechSynthesis.cancel();

      const speechCleaned = cleanSpokenText(text);

      const voices = voicesCacheRef.current.length > 0 ? voicesCacheRef.current : await loadVoices();
      const arabicVoice = pickArabicVoice(voices);

      // لو مفيش صوت عربي متاح لا ننطق بصوت أجنبي يُخرّج الكلام غير مفهوم
      if (!arabicVoice) return resolve();

      const utterance = new SpeechSynthesisUtterance(speechCleaned);
      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang; // يطابق لغة الصوت المختار فعلياً
      utterance.rate = 0.9; // أوضح للنطق العربي
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [loadVoices]);

  const stopAudioPlayback = () => {
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current.src = '';
      ttsAudioRef.current = null;
    }
  };

  // الصوت السحابي عالي الجودة — يرجع Promise بيخلص لما النطق يخلص، مع الرجوع لصوت المتصفح عند أي فشل
  const speakText = useCallback((text: string): Promise<void> => {
    return new Promise(async (resolve) => {
      if (typeof window === 'undefined') return resolve();
      stopAudioPlayback();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();

      const speechCleaned = cleanSpokenText(text);
      if (!speechCleaned) return resolve();

      ttsDoneRef.current = resolve; // لو المستخدم وقف الصوت نفضّل أي انتظار معلّق

      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: speechCleaned }),
        });
        if (!res.ok) throw new Error('cloud TTS failed');

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        ttsAudioRef.current = audio;
        const finish = () => {
          ttsDoneRef.current = null;
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onplay = () => setIsSpeaking(true);
        audio.onended = finish;
        audio.onerror = finish;
        await audio.play();
      } catch {
        ttsDoneRef.current = null;
        await browserSpeak(speechCleaned);
        resolve();
      }
    });
  }, [browserSpeak]);

  const stopSpeaking = () => {
    stopAudioPlayback();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    if (ttsDoneRef.current) {
      const done = ttsDoneRef.current;
      ttsDoneRef.current = null;
      done();
    }
  };

  // إيقاف كل محركات التسجيل (الميكروفون + التعرف اللحظي + مراقب السكوت)
  const stopRecordingEngines = () => {
    if (silenceWatcherRef.current) {
      clearInterval(silenceWatcherRef.current);
      silenceWatcherRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // تجاهل
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Start Voice Recording — بيكتب كلامك لحظة بلحظة ويبعته تلقائياً لما تخلص
  const startRecording = async () => {
    stopSpeaking();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      finalTranscriptRef.current = '';
      sentRef.current = false;
      heardAnythingRef.current = false;
      lastResultAtRef.current = Date.now();
      setLiveTranscript('');

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // هنا فقط نقفل الميكروفون — المعالجة بقت في sendHeardSpeech
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();

      // التعرف اللحظي على الكلام (Web Speech) — يكتب النص أثناء الكلام
      const SpeechRecognitionCtor: any =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionCtor) {
        const recognition = new SpeechRecognitionCtor();
        recognitionRef.current = recognition;
        recognition.lang = 'ar-EG';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          lastResultAtRef.current = Date.now();
          heardAnythingRef.current = true;
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const chunk: string = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += chunk + ' ';
            } else {
              interim += chunk;
            }
          }
          setLiveTranscript((finalTranscriptRef.current + interim).trim());
        };

        recognition.onerror = () => {
          // نكمل بالتسجيل العادي كاحتياطي
        };

        recognition.onend = () => {
          // التعرف انتهى لوحده (سكوت) والمستخدم لسه مسجل → يبعث كلامه تلقائياً
          if (recordingActiveRef.current) {
            recordingActiveRef.current = false;
            setIsRecording(false);
            stopRecordingEngines();
            sendHeardSpeech();
          }
        };

        try {
          recognition.start();
        } catch {
          // تجاهل فشل بدء التعرف
        }
      }

      recordingActiveRef.current = true;
      setIsRecording(true);

      // مراقب السكوت: لو المستخدم قال حاجة وسكت ~2 ثانية → يبعث كلامه تلقائياً
      if (silenceWatcherRef.current) clearInterval(silenceWatcherRef.current);
      silenceWatcherRef.current = setInterval(() => {
        if (!recordingActiveRef.current) return;
        if (heardAnythingRef.current && Date.now() - lastResultAtRef.current > 2000) {
          stopRecording();
        }
      }, 400);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('يرجى السماح بالوصول إلى الميكروفون للتحدث مع المساعد الذكي.');
      setIsRecording(false);
    }
  };

  // إرسال الكلام المسموع — النص اللحظي أولاً، ولو مفيش نجرّب AssemblyAI على التسجيل
  const sendHeardSpeech = async () => {
    if (sentRef.current) return;
    sentRef.current = true;
    const heard = finalTranscriptRef.current.trim();
    finalTranscriptRef.current = '';
    setLiveTranscript('');

    if (heard) {
      await handleAssistantQuery(heard);
    } else if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      audioChunksRef.current = [];
      await processAudioSpeech(audioBlob);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: 'معلش ما سمعتكش كويس، ممكن تجرب تتكلم تاني وتوضح كلامك؟',
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Stop Voice Recording — زر الإرسال اليدوي
  const stopRecording = () => {
    if (!recordingActiveRef.current) return;
    recordingActiveRef.current = false;
    setIsRecording(false);
    stopRecordingEngines();
    sendHeardSpeech();
  };

  // Process Speech via AssemblyAI
  const processAudioSpeech = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'command.webm');

      const sttRes = await fetch('/api/speech', {
        method: 'POST',
        body: formData,
      });

      if (!sttRes.ok) {
        throw new Error('فشل التعرف على الصوت');
      }

      const sttData = await sttRes.json();
      const transcribedText = (sttData.text || '').trim();

      if (!transcribedText) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'assistant',
            text: 'معلش ما سمعتكش كويس، ممكن تجرب تتكلم تاني وتوضح كلامك؟',
            timestamp: new Date(),
          },
        ]);
        setIsProcessing(false);
        return;
      }

      await handleAssistantQuery(transcribedText);
    } catch (err) {
      console.error('Audio processing error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: 'حصل خطأ في معالجة الصوت، جرب تاني أو اكتبلي رسالتك.',
          timestamp: new Date(),
        },
      ]);
      setIsProcessing(false);
    }
  };

  // Execute Action
  const executeAction = useCallback((data: AssistantActionPayload) => {
    if (data.action === 'play_surah' && data.surahId) {
      playAudio(
        data.surahId,
        data.surahName || `سورة رقم ${data.surahId}`,
        data.ayahNumber || 1,
        'surah',
        data.totalVerses
      );
    } else if (data.action === 'navigate' && data.tab) {
      const dest = data.tab === 'home' ? '/' : `/${data.tab}`;
      router.push(dest);
    } else if (data.action === 'search') {
      openSearch();
    }
  }, [playAudio, openSearch, router]);

  // Query Assistant
  const handleAssistantQuery = async (queryText: string) => {
    const userMsg: MessageItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // نبعت آخر 6 رسائل كسياق عشان المساعد يفتكر المحادثة زي شخص حقيقي
      const history = messages.slice(-6).map((m) => ({ role: m.sender, text: m.text }));
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: queryText, history }),
      });

      const data: AssistantActionPayload = await res.json();

      const assistantMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.detailedAnswer || data.reply,
        payload: data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // ينطق الرد كامل بصوت عالٍ، ولا يشغّل السورة إلا بعد ما يخلص الكلام
      if (data.action === 'play_surah' && data.surahId) {
        if (autoSpeak) {
          await speakText(data.detailedAnswer || data.reply);
        }
        executeAction(data);
      } else if (autoSpeak && (data.detailedAnswer || data.reply)) {
        speakText(data.detailedAnswer || data.reply);
      }
    } catch (err) {
      console.error('Assistant query error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'معلش في مشكلة في الاتصال حالياً، اتأكد من النت وجرب تاني.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const q = inputText.trim();
    setInputText('');
    handleAssistantQuery(q);
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([]);
  };

  return (
    <>
      {mounted && (
        <>
      {/* 1. Floating Launch Button - round FAB above bottom nav (mobile) / corner (desktop) */}
      <div className="fixed bottom-20 left-4 lg:bottom-6 lg:left-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(15,56,44,0.4)] border border-[#C5A059]/50 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            isOpen
              ? 'bg-gray-900 text-white dark:bg-gray-800'
              : 'bg-gradient-to-tr from-[#0F382C] to-[#164E3D] text-[#C5A059]'
          }`}
          aria-label="المساعد الذكي"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <span className="absolute inset-0 rounded-full bg-[#C5A059]/25 animate-ping [animation-duration:2.5s]"></span>
              <MessageCircle className="w-6 h-6 relative" />
            </>
          )}
        </button>
      </div>

      {/* 2. Chat Panel - docked right above the FAB */}
      {isOpen && (
        <div 
          className="fixed bottom-36 left-3 right-3 lg:bottom-24 lg:left-6 lg:right-auto z-50 lg:w-[400px] h-[65vh] max-h-[560px] bg-[#FAF8F5] dark:bg-[#0E1714] border border-[#0F382C]/15 dark:border-[#C5A059]/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden text-[#1A2421] dark:text-[#F5F7F6] font-sans animate-in fade-in slide-in-from-bottom-4 duration-200"
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F382C] to-[#164E3D] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#C5A059]/20 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C5A059] text-gray-950 flex items-center justify-center font-bold text-sm shadow-sm">
                <Sparkles className="w-4 h-4 text-gray-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    مساعد سَنَد الذكي
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-gray-300 flex items-center gap-1">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      isRecording
                        ? 'bg-red-400 animate-pulse'
                        : isProcessing
                        ? 'bg-amber-300 animate-pulse'
                        : isSpeaking
                        ? 'bg-sky-300 animate-pulse'
                        : 'bg-emerald-400'
                    }`}
                  ></span>
                  {isRecording
                    ? 'بسمعك دلوقتي… اتكلم براحتك'
                    : isProcessing
                    ? 'بيفكر في الرد…'
                    : isSpeaking
                    ? 'بيتكلم دلوقتي…'
                    : 'متصل الآن • اسألني أي حاجة'}
                </p>
              </div>
            </div>

            {/* Header Action Icons */}
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="مسح المحادثة"
                  className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setAutoSpeak(!autoSpeak);
                }}
                title={autoSpeak ? 'كتم الصوت' : 'تشغيل الصوت'}
                className={`p-1.5 rounded-lg border transition-all ${
                  autoSpeak 
                    ? 'bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/40' 
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  stopRecording();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="إغلاق"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-[#FAF8F5] dark:bg-[#0E1714]">
            
            {/* Welcome / Empty State */}
            {messages.length === 0 && !isRecording && (
              <div className="h-full flex flex-col items-center justify-center text-center p-3 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0F382C]/10 dark:bg-[#C5A059]/10 border border-[#0F382C]/15 dark:border-[#C5A059]/25 flex items-center justify-center text-[#0F382C] dark:text-[#C5A059]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F382C] dark:text-white">
                    أهلاً بيك في مساعد سَنَد!
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                    اتكلم بالميكروفون أو اكتب، وأنا تحت أمرك أشغلك أي سورة أو أجاوبك على أي سؤال.
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className="w-full space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold text-gray-400 text-right">
                    جرب تقول:
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[
                      'شغل سورة الكهف',
                      'أذكار الصباح والمساء',
                      'فاضل قد إيه على صلاة العصر؟',
                      'ما هي أركان الإسلام؟'
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => handleAssistantQuery(item)}
                        className="text-right text-[11px] font-medium bg-white dark:bg-[#15231F] hover:bg-[#0F382C] hover:text-white dark:hover:bg-[#C5A059] dark:hover:text-gray-950 border border-gray-200/80 dark:border-gray-800 text-gray-700 dark:text-gray-200 px-3.5 py-2 rounded-xl shadow-xs transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages Thread */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-start' : 'items-end'
                }`}
              >
                {/* User Message Bubble */}
                {msg.sender === 'user' ? (
                  <div className="max-w-[85%] bg-[#0F382C] text-white rounded-2xl rounded-tr-none px-3.5 py-2 text-xs font-medium shadow-xs">
                    {msg.text}
                  </div>
                ) : (
                  /* Assistant Message Card */
                  <div className="max-w-[92%] bg-white dark:bg-[#15231F] border border-gray-200/80 dark:border-gray-800 rounded-2xl rounded-tl-none p-3.5 text-gray-800 dark:text-gray-100 shadow-xs space-y-2">
                    
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-800/80">
                      <span className="text-[10px] font-bold text-[#C5A059] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        سَنَد AI
                      </span>
                      <button
                        onClick={() => speakText(msg.text)}
                        title="إعادة نطق الإجابة"
                        className="text-gray-400 hover:text-[#0F382C] dark:hover:text-[#C5A059] transition-colors p-0.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs leading-relaxed whitespace-pre-line font-arabic">
                      {msg.text}
                    </div>

                    {/* Sources */}
                    {msg.payload?.sources && msg.payload.sources.length > 0 && (
                      <div className="pt-1.5 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap items-center gap-1">
                        <span className="text-[9px] text-gray-400 font-bold">المصدر:</span>
                        {msg.payload.sources.map((src, idx) => (
                          <span
                            key={idx}
                            className="bg-[#C5A059]/15 text-[#0F382C] dark:text-[#C5A059] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#C5A059]/30"
                          >
                            {src.title}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Play Surah Action Button */}
                    {msg.payload?.action === 'play_surah' && msg.payload.surahId && (
                      <button
                        onClick={() => executeAction(msg.payload!)}
                        className="w-full mt-1.5 flex items-center justify-center gap-2 bg-[#0F382C] hover:bg-[#164E3D] text-[#C5A059] font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition-all active:scale-98"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>استمع إلى سورة {msg.payload.surahName || ''} الآن</span>
                      </button>
                    )}

                    {/* Navigate Action Button */}
                    {msg.payload?.action === 'navigate' && msg.payload.tab && (
                      <button
                        onClick={() => executeAction(msg.payload!)}
                        className="w-full mt-1.5 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#0F382C] dark:text-white font-bold text-[11px] py-2 px-3 rounded-xl transition-all"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>فتح القسم الآن</span>
                      </button>
                    )}

                  </div>
                )}

                <span className="text-[9px] text-gray-400 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Processing — مؤشر كتابة زي الشات الحقيقي */}
            {isProcessing && (
              <div className="flex items-end gap-2">
                <div className="bg-white dark:bg-[#15231F] border border-gray-200/80 dark:border-gray-800 rounded-2xl rounded-tl-none p-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce [animation-delay:300ms]"></span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                      بيكتبلك الرد…
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-white dark:bg-[#111A17] border-t border-gray-200/80 dark:border-gray-800 shrink-0">
            {isRecording ? (
              /* Recording State — بيكتب كلامك لحظة بلحظة */
              <div className="p-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl animate-fade-in space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">
                      سامعك ({recordingSeconds} ث) وبكتب كلامك…
                    </span>
                  </div>

                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-transform active:scale-95"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>إرسال</span>
                  </button>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-200 font-arabic leading-relaxed min-h-[1.25rem]">
                  {liveTranscript || 'اتكلم وأنا هكتب اللي بتقوله هنا…'}
                </p>
              </div>
            ) : (
              /* Text Input & Mic Button */
              <div className="flex items-center gap-1.5">
                <button
                  onClick={startRecording}
                  disabled={isProcessing}
                  className="w-10 h-10 rounded-xl bg-[#0F382C] hover:bg-[#164E3D] text-[#C5A059] flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
                  title="تحدث بالصوت"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <form onSubmit={handleTextSubmit} className="flex-1 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isProcessing}
                    placeholder="اكتب سؤالك أو اطلب سورة..."
                    className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isProcessing}
                    className="w-10 h-10 rounded-xl bg-[#C5A059] hover:bg-[#d8b368] text-gray-950 flex items-center justify-center font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shrink-0 shadow-xs"
                    title="إرسال"
                  >
                    <Send className="w-4 h-4 rotate-180" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}
    </>
  );

};
