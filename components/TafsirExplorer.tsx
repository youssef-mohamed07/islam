'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ChevronDown } from 'lucide-react';

export const TafsirExplorer: React.FC = () => {
  const [surahsList, setSurahsList] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [ayahNumber, setAyahNumber] = useState(1);
  const [selectedTafsir, setSelectedTafsir] = useState<'saadi' | 'ibnKathir'>('saadi');

  const [ayahText, setAyahText] = useState<string>('');
  const [tafsirHtml, setTafsirHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load surahs
  useEffect(() => {
    fetch('/api/quran/surahs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSurahsList(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch Tafsir and Ayah text when selection changes
  useEffect(() => {
    if (!selectedSurah || !ayahNumber) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setTafsirHtml('');
    setAyahText('');

    const fetchTafsirAndAyah = async () => {
      try {
        // 1. Fetch Ayah text
        const versesRes = await fetch(`/api/quran/verses/${selectedSurah}`);
        if (!versesRes.ok) throw new Error('Failed to fetch verses');
        const versesData = await versesRes.json();
        const targetVerse = versesData.find((v: any) => v.verse_key === `${selectedSurah}:${ayahNumber}`);
        
        if (!targetVerse) {
          throw new Error('الآية غير موجودة في هذه السورة');
        }
        
        if (isMounted) setAyahText(targetVerse.text_uthmani);

        // 2. Fetch Tafsir
        const slug = selectedTafsir === 'saadi' ? 'ar-tafseer-al-saddi' : 'ar-tafsir-ibn-kathir';
        const tafsirRes = await fetch(`/api/quran/tafsir/${slug}/${selectedSurah}:${ayahNumber}`);
        if (!tafsirRes.ok) throw new Error('Failed to fetch tafsir');
        const tafsirData = await tafsirRes.json();
        
        if (isMounted && tafsirData.tafsir && tafsirData.tafsir.text) {
          setTafsirHtml(tafsirData.tafsir.text);
        } else {
          throw new Error('التفسير غير متوفر لهذه الآية');
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTafsirAndAyah();

    return () => { isMounted = false; };
  }, [selectedSurah, ayahNumber, selectedTafsir]);

  const maxAyahs = surahsList.find(s => s.id === selectedSurah)?.versesCount || 286;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#0F382C] dark:text-[#C5A059] mb-4">
          الباحث في التفسير
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-2xl mx-auto">
          تصفح وقارن بين أشهر التفاسير المعتمدة للآيات القرآنية من المصادر الموثوقة.
        </p>
      </div>

      {/* Selectors */}
      <div className="bg-white dark:bg-[#162621] p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 mb-8 flex flex-wrap gap-4 items-center justify-between">
        
        <div className="flex items-center space-x-4 space-x-reverse flex-1">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-500 mb-1">السورة</label>
            <div className="relative">
              <select
                value={selectedSurah}
                onChange={(e) => {
                  setSelectedSurah(Number(e.target.value));
                  setAyahNumber(1);
                }}
                className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold text-[#0F382C] dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              >
                {surahsList.length === 0 && <option>جاري التحميل...</option>}
                {surahsList.map(s => (
                  <option key={s.id} value={s.id}>{s.id}. {s.nameArabic}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="w-24">
            <label className="block text-xs font-bold text-gray-500 mb-1">رقم الآية</label>
            <input
              type="number"
              min={1}
              max={maxAyahs}
              value={ayahNumber}
              onChange={(e) => {
                let val = Number(e.target.value);
                if (val > maxAyahs) val = maxAyahs;
                if (val < 1) val = 1;
                setAyahNumber(val);
              }}
              className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold text-center text-[#0F382C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>
        </div>

        <div className="w-full md:w-auto">
          <label className="block text-xs font-bold text-gray-500 mb-1">المفسر</label>
          <div className="flex items-center bg-gray-50 dark:bg-[#0D1412] p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSelectedTafsir('saadi')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedTafsir === 'saadi' ? 'bg-[#0F382C] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              تفسير السعدي
            </button>
            <button
              onClick={() => setSelectedTafsir('ibnKathir')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedTafsir === 'ibnKathir' ? 'bg-[#0F382C] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              تفسير ابن كثير
            </button>
          </div>
        </div>
        
      </div>

      {/* Result Display */}
      {isLoading ? (
        <div className="text-center py-20 bg-white dark:bg-[#162621] rounded-3xl border border-gray-200/80 dark:border-gray-800">
          <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-[#C5A059]">جاري جلب التفسير المحقق...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-white dark:bg-[#162621] rounded-3xl border border-gray-200/80 dark:border-gray-800">
          <p className="text-red-500 font-bold mb-2">تعذر جلب التفسير</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      ) : tafsirHtml ? (
        <div className="bg-white dark:bg-[#162621] p-8 rounded-3xl shadow-soft border border-gray-200/80 dark:border-gray-800">
          <div className="text-center mb-8">
            <span className="text-[#C5A059] font-bold text-sm bg-[#C5A059]/10 px-4 py-1.5 rounded-full border border-[#C5A059]/20">
              سورة {surahsList.find(s => s.id === selectedSurah)?.nameArabic} - الآية {ayahNumber}
            </span>
          </div>

          {ayahText && (
            <div className="font-quran text-3xl md:text-4xl text-[#0F382C] dark:text-[#F5F7F6] text-center mb-10 leading-[2.5]">
              {ayahText} <span className="inline-flex items-center justify-center min-w-[1.8em] h-[1.8em] rounded-full border-[1.5px] border-[#C5A059] text-[0.4em] font-mono text-[#C5A059] mx-2 align-middle font-bold">{ayahNumber}</span>
            </div>
          )}

          <div className="relative mt-12">
            <div className="absolute top-0 right-6 -mt-3 bg-white dark:bg-[#162621] px-2 text-xs font-bold text-[#0F382C] dark:text-[#C5A059] flex items-center space-x-1 space-x-reverse border border-gray-200 dark:border-gray-700 rounded-lg">
              <BookOpen className="w-3 h-3" />
              <span>{selectedTafsir === 'saadi' ? 'تيسير الكريم الرحمن في تفسير كلام المنان (السعدي)' : 'تفسير القرآن العظيم (ابن كثير)'}</span>
            </div>
            
            <div className="bg-gray-50 dark:bg-[#0D1412] p-8 pt-10 rounded-2xl border border-gray-100 dark:border-gray-800">
              {/* Tafsir text from quran.com api contains basic html tags like <p> */}
              <div 
                className="prose dark:prose-invert prose-lg max-w-none text-gray-800 dark:text-gray-200 leading-loose text-justify font-sans tafsir-content"
                dangerouslySetInnerHTML={{ __html: tafsirHtml }}
              />
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
};
