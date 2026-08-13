'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Bookmark, Share2, Copy, Check, Type, Layout, AlignJustify, X, BookOpen, ChevronDown } from 'lucide-react';
import { MOCK_SURAHS, MOCK_AYAH_SAMPLE } from './MockData';
import { BottomSheet } from './BottomSheet';

interface QuranStudioProps {
  onPlayAudio: (surahId: number, surahName: string, ayahNumber: number, playMode?: 'verse' | 'surah', totalVerses?: number) => void;
}

export const QuranStudio: React.FC<QuranStudioProps> = ({ onPlayAudio }) => {
  const [surahsList, setSurahsList] = useState(MOCK_SURAHS);
  const [selectedSurah, setSelectedSurah] = useState(MOCK_SURAHS[0]);
  const [readingMode, setReadingMode] = useState<'mushaf' | 'verseByVerse'>('mushaf');
  const [selectedTafsir, setSelectedTafsir] = useState<'none' | 'saadi' | 'ibnKathir'>('none');
  const [selectedQiraah, setSelectedQiraah] = useState('hafs');
  const [copiedAyahId, setCopiedAyahId] = useState<number | null>(null);
  
  // New States for fetching all verses and appearance
  const [verses, setVerses] = useState<any[]>([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);
  const [fontSize, setFontSize] = useState('text-4xl');
  
  // New States for Tafsir
  const [tafsirsDict, setTafsirsDict] = useState<Record<string, string>>({});
  const [isLoadingTafsir, setIsLoadingTafsir] = useState(false);

  // Inline tafsir popup state
  const [popoverAyahKey, setPopoverAyahKey] = useState<string | null>(null);
  const [popupTafsirSource, setPopupTafsirSource] = useState<'saadi' | 'ibnKathir'>('saadi');
  const [popupTafsirsDict, setPopupTafsirsDict] = useState<Record<string, string>>({});
  const [isLoadingPopupTafsir, setIsLoadingPopupTafsir] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Mobile surah picker sheet
  const [isSurahSheetOpen, setIsSurahSheetOpen] = useState(false);

  // Fetch live Surahs on mount
  useEffect(() => {
    fetch('/api/quran/surahs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSurahsList(data);
          setSelectedSurah(data[0]);
        }
      })
      .catch((err) => console.warn('Using default surahs list:', err));
  }, []);

  // Fetch all verses when selectedSurah changes
  useEffect(() => {
    if (!selectedSurah) return;
    setPopoverAyahKey(null);
    setIsLoadingVerses(true);
    fetch(`/api/quran/verses/${selectedSurah.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVerses(data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch verses', err);
      })
      .finally(() => {
        setIsLoadingVerses(false);
      });
  }, [selectedSurah]);

  // Fetch all tafsirs for the chapter when selectedTafsir or selectedSurah changes
  useEffect(() => {
    if (!selectedSurah || selectedTafsir === 'none') {
      setTafsirsDict({});
      return;
    }
    
    const slug = selectedTafsir === 'saadi' ? 'ar-tafseer-al-saddi' : 'ar-tafsir-ibn-kathir';
    setIsLoadingTafsir(true);
    
    fetch(`/api/quran/tafsir/${slug}/by_chapter/${selectedSurah.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const dict: Record<string, string> = {};
          data.forEach((item: any) => {
            dict[item.verse_key] = item.text;
          });
          setTafsirsDict(dict);
        }
      })
      .catch(err => console.error('Failed to fetch chapter tafsirs', err))
      .finally(() => setIsLoadingTafsir(false));
      
  }, [selectedSurah, selectedTafsir]);

  // Always fetch tafsir for inline popup feature
  useEffect(() => {
    if (!selectedSurah) return;
    const slug = popupTafsirSource === 'saadi' ? 'ar-tafseer-al-saddi' : 'ar-tafsir-ibn-kathir';
    setIsLoadingPopupTafsir(true);
    fetch(`/api/quran/tafsir/${slug}/by_chapter/${selectedSurah.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const dict: Record<string, string> = {};
          data.forEach((item: any) => {
            dict[item.verse_key] = item.text;
          });
          setPopupTafsirsDict(dict);
        }
      })
      .catch(err => console.error('Failed to fetch popup tafsirs', err))
      .finally(() => setIsLoadingPopupTafsir(false));
  }, [selectedSurah, popupTafsirSource]);

  // Close popover on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopoverAyahKey(null);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedAyahId(id);
    setTimeout(() => setCopiedAyahId(null), 2000);
  };

  const fontSizes = [
    { id: 'text-2xl', label: 'صغير' },
    { id: 'text-3xl', label: 'متوسط' },
    { id: 'text-4xl', label: 'كبير' },
    { id: 'text-5xl', label: 'أكبر' },
    { id: 'text-6xl', label: 'ضخم' },
  ];

  // Font size stepper for the mobile compact bar
  const changeFontSize = (delta: number) => {
    const index = fontSizes.findIndex((fs) => fs.id === fontSize);
    const next = Math.min(Math.max(index + delta, 0), fontSizes.length - 1);
    setFontSize(fontSizes[next].id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Mobile Compact Sticky Control Bar */}
      <div className="lg:hidden sticky top-14 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-[#FDFBF7]/95 dark:bg-[#0D1412]/95 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 space-y-2 mb-4">
        {/* Surah Picker + Font Stepper */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSurahSheetOpen(true)}
            className="flex-1 flex items-center justify-between bg-[#0F382C] text-white px-4 py-2.5 rounded-xl text-sm font-bold active:scale-[0.98] transition-transform min-w-0"
          >
            <span className="truncate min-w-0">سورة {selectedSurah.nameArabic}</span>
            <span className="flex items-center text-[10px] text-emerald-100/80 font-normal shrink-0 mr-2">
              {selectedSurah.versesCount} آية
              <ChevronDown className="w-4 h-4 mr-1 text-[#C5A059]" />
            </span>
          </button>
          <div className="flex items-center bg-white dark:bg-[#162621] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shrink-0">
            <button
              onClick={() => changeFontSize(-1)}
              className="px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-700"
              title="تصغير الخط"
            >
              أ-
            </button>
            <span className="w-px h-5 bg-gray-200 dark:bg-gray-700"></span>
            <button
              onClick={() => changeFontSize(1)}
              className="px-3 py-2 text-sm font-bold text-[#0F382C] dark:text-[#C5A059] active:bg-gray-100 dark:active:bg-gray-700"
              title="تكبير الخط"
            >
              أ+
            </button>
          </div>
        </div>

        {/* Mode Toggle + Qira'at + Tafsir */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-[#0D1412] p-0.5 rounded-lg border border-gray-200 dark:border-gray-800 shrink-0">
            <button
              onClick={() => setReadingMode('mushaf')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                readingMode === 'mushaf' ? 'bg-[#0F382C] text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              المصحف
            </button>
            <button
              onClick={() => setReadingMode('verseByVerse')}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                readingMode === 'verseByVerse' ? 'bg-[#0F382C] text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              آية بآية
            </button>
          </div>
          <select
            value={selectedQiraah}
            onChange={(e) => setSelectedQiraah(e.target.value)}
            className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-[11px] font-bold text-gray-800 dark:text-gray-200"
          >
            <option value="hafs">حفص عن عاصم</option>
            <option value="warsh">ورش عن نافع</option>
          </select>
          {readingMode === 'verseByVerse' && (
            <select
              value={selectedTafsir}
              onChange={(e) => setSelectedTafsir(e.target.value as any)}
              className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-[11px] font-bold text-gray-800 dark:text-gray-200"
            >
              <option value="none">بدون تفسير</option>
              <option value="saadi">تفسير السعدي</option>
              <option value="ibnKathir">تفسير ابن كثير</option>
            </select>
          )}
        </div>
      </div>

      {/* Header & Modes Bar (Desktop Only) */}
      <div className="hidden lg:block bg-white dark:bg-[#162621] p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <h1 className="text-3xl font-extrabold text-[#0F382C] dark:text-[#F5F7F6]">
                القرآن الكريم
              </h1>
              <span className="bg-[#C5A059]/15 text-[#0F382C] dark:text-[#C5A059] text-xs font-semibold px-3 py-1 rounded-full border border-[#C5A059]/30">
                114 سورة • قراءة واستماع وتفسير
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              تصفح جميع الآيات بخط عثماني أصيل مع تحكم كامل في المظهر
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <span className="text-xs font-bold text-gray-500">طريقة العرض:</span>
              <div className="flex items-center space-x-1 space-x-reverse bg-gray-100 dark:bg-[#0D1412] p-1 rounded-xl border border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setReadingMode('mushaf')}
                  className={`flex items-center space-x-1 space-x-reverse px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    readingMode === 'mushaf'
                      ? 'bg-[#0F382C] text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-black'
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                  <span>شكل المصحف</span>
                </button>
                <button
                  onClick={() => setReadingMode('verseByVerse')}
                  className={`flex items-center space-x-1 space-x-reverse px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    readingMode === 'verseByVerse'
                      ? 'bg-[#0F382C] text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-black'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>آية بآية</span>
                </button>
              </div>
            </div>

            {/* Font Size Controls */}
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <span className="text-xs font-bold text-gray-500 flex items-center">
                <Type className="w-3.5 h-3.5 ml-1" />
                حجم الخط:
              </span>
              <div className="flex items-center space-x-1 space-x-reverse bg-gray-100 dark:bg-[#0D1412] p-1 rounded-xl border border-gray-200 dark:border-gray-800">
                {fontSizes.map(fs => (
                  <button
                    key={fs.id}
                    onClick={() => setFontSize(fs.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      fontSize === fs.id
                        ? 'bg-[#C5A059] text-gray-950 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-black'
                    }`}
                  >
                    {fs.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Qira'at Selector Row */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between text-xs gap-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="font-semibold text-[#0F382C] dark:text-[#C5A059]">القراءة والرواية:</span>
            <select
              value={selectedQiraah}
              onChange={(e) => setSelectedQiraah(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-xs text-gray-800 dark:text-gray-200"
            >
              <option value="hafs">رواية حفص عن عاصم</option>
              <option value="warsh">رواية ورش عن نافع</option>
            </select>
          </div>

          {readingMode === 'verseByVerse' && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="font-semibold text-[#0F382C] dark:text-[#C5A059]">التفسير والترجمة:</span>
              <select
                value={selectedTafsir}
                onChange={(e) => setSelectedTafsir(e.target.value as any)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-xs text-gray-800 dark:text-gray-200"
              >
                <option value="none">بدون تفسير</option>
                <option value="saadi">تفسير السعدي</option>
                <option value="ibnKathir">تفسير ابن كثير</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Surahs Sidebar & Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Surahs List Sidebar (Desktop Only - mobile uses the bottom sheet picker) */}
        <div className="hidden lg:block lg:col-span-1 bg-white dark:bg-[#162621] rounded-2xl p-4 shadow-soft border border-gray-200/80 dark:border-gray-800 max-h-[700px] overflow-y-auto">
          <h3 className="font-bold text-sm text-[#0F382C] dark:text-[#C5A059] mb-3 px-2 flex items-center justify-between">
            <span>فهرس السور</span>
            <span className="text-[10px] text-gray-400 font-normal">{surahsList.length} سورة</span>
          </h3>
          <div className="space-y-1">
            {surahsList.map((surah) => {
              const isSelected = selectedSurah.id === surah.id;
              return (
                <button
                  key={surah.id}
                  onClick={() => setSelectedSurah(surah)}
                  className={`w-full text-right p-3 rounded-xl transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#0F382C] text-white font-bold shadow-md'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs ${
                      isSelected ? 'bg-[#C5A059] text-gray-950 font-bold' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>
                      {surah.id}
                    </span>
                    <div>
                      <div className="text-sm font-bold">{surah.nameArabic}</div>
                      <div className="text-[10px] opacity-75">{surah.nameEnglish}</div>
                    </div>
                  </div>
                  <div className="text-left text-[10px] opacity-75">
                    <div>{surah.revelationPlace === 'Makkah' ? 'مكية' : 'مدنية'}</div>
                    <div>{surah.versesCount} آية</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reader Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Surah Banner Card */}
          <div className="bg-gradient-to-br from-[#0F382C] to-[#164E3D] text-white p-5 sm:p-8 rounded-2xl shadow-card text-center relative overflow-hidden border border-[#C5A059]/30">
            <div className="absolute top-0 right-0 p-8 opacity-10 font-quran text-9xl pointer-events-none">
              {selectedSurah.nameArabic}
            </div>
            <h2 className="font-quran text-3xl sm:text-5xl font-bold text-[#C5A059] mb-2">
              سُورَةُ {selectedSurah.nameArabic}
            </h2>
            <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-[11px] sm:text-xs text-emerald-100/90 font-medium">
              <span>مكان النزول: {selectedSurah.revelationPlace === 'Makkah' ? 'مكة المكرمة' : 'المدينة المنورة'}</span>
              <span>•</span>
              <span>عدد الآيات: {selectedSurah.versesCount}</span>
              <span>•</span>
              <span>الصفحات: {selectedSurah.pages ? `${selectedSurah.pages[0]} - ${selectedSurah.pages[1]}` : '1'}</span>
            </div>

            {selectedSurah.bismillahPre && (
              <div className="mt-6 font-quran text-3xl text-[#C5A059]">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>
            )}

            <div className="mt-6 flex justify-center relative z-10">
               <button 
                 onClick={() => onPlayAudio(selectedSurah.id, selectedSurah.nameArabic, 1, 'surah', selectedSurah.versesCount)}
                 className="flex items-center space-x-2 space-x-reverse bg-[#C5A059] hover:bg-[#B28E46] text-[#0F382C] px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md active:scale-95"
               >
                 <Play className="w-4 h-4 fill-current" />
                 <span>تشغيل السورة كاملة</span>
               </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingVerses ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#C5A059]">
              <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold">جاري تحميل الآيات...</p>
            </div>
          ) : (
            <>
              {/* Mushaf Mode View */}
              {readingMode === 'mushaf' && (
                <div className="bg-[#FDFBF7] dark:bg-[#111915] p-4 sm:p-12 rounded-2xl shadow-inner border border-[#0F382C]/10 dark:border-[#C5A059]/20">
                  <div className={`font-quran ${fontSize} text-[#0F382C] dark:text-[#E8E6E1] text-justify leading-[2.5] select-text`}>
                    {verses.map((verse) => {
                      const ayahNum = verse.verse_key.split(':')[1];
                      return (
                        <span 
                          key={verse.id} 
                          className="inline relative hover:bg-[#C5A059]/10 transition-colors rounded px-1 cursor-pointer"
                          onClick={() => setPopoverAyahKey(verse.verse_key)}
                          title="اضغط لعرض التفسير والتشغيل"
                        >
                          {verse.text_uthmani}
                          <span className="inline-flex items-center justify-center min-w-[1.8em] h-[1.8em] rounded-full border-[1.5px] border-[#C5A059] text-[0.4em] font-mono text-[#C5A059] mx-2 align-middle font-bold">
                            {ayahNum}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Verse by Verse View */}
              {readingMode === 'verseByVerse' && (
                <div className="space-y-4">
                  {verses.map((verse) => {
                    const ayahNum = parseInt(verse.verse_key.split(':')[1], 10);
                    return (
                      <div
                        key={verse.id}
                        className="bg-white dark:bg-[#162621] p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 transition-all hover:border-[#0F382C]/30"
                      >
                        {/* Verse Actions Header */}
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                          <span className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-[#0F382C] dark:text-[#C5A059] font-bold">
                            الآية {ayahNum}
                          </span>
                          
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <button
                              onClick={() => onPlayAudio(selectedSurah.id, selectedSurah.nameArabic, ayahNum)}
                              className="flex items-center space-x-1 space-x-reverse text-[#0F382C] dark:text-[#C5A059] hover:bg-emerald-50 dark:hover:bg-emerald-950 px-3 py-1.5 rounded-lg transition-colors font-bold"
                            >
                              <Play className="w-4 h-4 fill-current ml-1" />
                              <span className="hidden sm:inline">تشغيل</span>
                            </button>

                            <button
                              onClick={() => handleCopy(`${verse.text_uthmani} [سورة ${selectedSurah.nameArabic}: ${ayahNum}]`, ayahNum)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-black dark:hover:text-white"
                              title="نسخ الآية"
                            >
                              {copiedAyahId === ayahNum ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                            </button>

                            <button className="p-1.5 rounded-lg text-gray-500 hover:text-[#C5A059]">
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Uthmanic Arabic Text - Click for Tafsir */}
                        <div 
                          className={`font-quran ${fontSize} text-[#0F382C] dark:text-[#F5F7F6] text-center my-6 leading-[2.5] cursor-pointer hover:bg-[#C5A059]/5 rounded-xl transition-colors p-2 relative group/verse`}
                          onClick={() => setPopoverAyahKey(verse.verse_key)}
                        >
                          {verse.text_uthmani}
                          <div className="opacity-0 group-hover/verse:opacity-100 transition-opacity absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#C5A059] bg-[#0F382C] px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                            <BookOpen className="w-3 h-3 inline ml-1" />
                            اضغط لعرض التفسير
                          </div>
                        </div>

                        {/* Tafsir Mode Display */}
                        {selectedTafsir !== 'none' && (
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0D1412] text-sm text-gray-800 dark:text-gray-200 font-quran leading-relaxed border border-gray-200/50 dark:border-gray-800">
                              <div className="font-bold text-xs text-[#C5A059] mb-4 flex items-center justify-between">
                                <span>{selectedTafsir === 'saadi' ? 'تفسير السعدي' : 'تفسير ابن كثير'}</span>
                                {isLoadingTafsir && <span className="text-gray-400">جاري التحميل...</span>}
                              </div>
                              <div className="prose dark:prose-invert max-w-none tafsir-content">
                                {tafsirsDict[verse.verse_key] ? (
                                  <div dangerouslySetInnerHTML={{ __html: tafsirsDict[verse.verse_key] }} />
                                ) : (
                                  <p className="text-gray-500">
                                    {isLoadingTafsir ? 'جاري جلب التفسير...' : 'التفسير غير متوفر لهذه الآية.'}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>
      {/* Tafsir Popup Overlay */}
      {popoverAyahKey && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={() => setPopoverAyahKey(null)}>
          <div 
            ref={popoverRef}
            className="bg-white dark:bg-[#162621] sm:rounded-3xl rounded-t-3xl shadow-2xl border border-gray-200/80 dark:border-gray-700 max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-l from-[#0F382C] to-[#164E3D] p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">تفسير الآية</h3>
                  <p className="text-emerald-200/80 text-xs">
                    سورة {selectedSurah.nameArabic} - الآية {popoverAyahKey.split(':')[1]}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => {
                    const ayahNum = parseInt(popoverAyahKey.split(':')[1]);
                    onPlayAudio(selectedSurah.id, selectedSurah.nameArabic, ayahNum);
                  }}
                  className="text-emerald-300 hover:text-[#C5A059] p-2 rounded-xl hover:bg-white/10 transition-colors"
                  title="تشغيل الآية"
                >
                  <Play className="w-5 h-5 fill-current" />
                </button>
                <button
                  onClick={() => setPopoverAyahKey(null)}
                  className="text-emerald-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ayah Text */}
            <div className="px-6 pt-6 pb-4">
              <div className="font-quran text-2xl text-[#0F382C] dark:text-[#F5F7F6] text-center leading-[2.2] p-4 bg-[#FDFBF7] dark:bg-[#0D1412] rounded-2xl border border-[#0F382C]/10 dark:border-[#C5A059]/20">
                {verses.find(v => v.verse_key === popoverAyahKey)?.text_uthmani}
              </div>
            </div>

            {/* Tafsir Source Tabs */}
            <div className="px-6 flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setPopupTafsirSource('saadi')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  popupTafsirSource === 'saadi'
                    ? 'bg-[#0F382C] text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                تفسير السعدي
              </button>
              <button
                onClick={() => setPopupTafsirSource('ibnKathir')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  popupTafsirSource === 'ibnKathir'
                    ? 'bg-[#0F382C] text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                تفسير ابن كثير
              </button>
            </div>

            {/* Tafsir Content */}
            <div className="px-6 py-5 overflow-y-auto max-h-[45vh]">
              {isLoadingPopupTafsir ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm text-gray-500 font-bold">جاري تحميل التفسير...</p>
                </div>
              ) : popupTafsirsDict[popoverAyahKey] ? (
                <div className="prose dark:prose-invert max-w-none text-sm text-gray-800 dark:text-gray-200 leading-relaxed tafsir-content">
                  <div dangerouslySetInnerHTML={{ __html: popupTafsirsDict[popoverAyahKey] }} />
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10 font-bold">
                  التفسير غير متوفر لهذه الآية حالياً.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Surah Picker Bottom Sheet */}
      <BottomSheet
        isOpen={isSurahSheetOpen}
        onClose={() => setIsSurahSheetOpen(false)}
        title="فهرس السور"
        searchable
        searchPlaceholder="ابحث عن سورة..."
        selectedId={String(selectedSurah.id)}
        items={surahsList.map((surah) => ({
          id: String(surah.id),
          label: `${surah.id}. سورة ${surah.nameArabic}`,
          sublabel: surah.nameEnglish,
          trailing: `${surah.versesCount} آية`,
        }))}
        onSelect={(id) => {
          const surah = surahsList.find((s) => String(s.id) === id);
          if (surah) setSelectedSurah(surah);
        }}
      />

    </div>
  );
};
