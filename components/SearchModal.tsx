'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ShieldCheck, Filter } from 'lucide-react';
import { SanadSearchEngine } from '@/lib/searchEngine';
import { UnifiedSearchResult } from '@/lib/types';
import { MOCK_AYAH_SAMPLE, MOCK_HADITHS, MOCK_FIQH_RULINGS, MOCK_SEERAH_EVENTS, MOCK_SCHOLARS, MOCK_BOOKS } from './MockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('الصبر');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [results, setResults] = useState<UnifiedSearchResult[]>([]);

  useEffect(() => {
    const engine = new SanadSearchEngine([
      {
        id: 'quran-2-153',
        type: 'quran',
        typeArabic: 'القرآن الكريم',
        title: 'سورة البقرة - الآية 153',
        subtitle: 'الجزء الثاني • الصفحة 24',
        textToSearch: MOCK_AYAH_SAMPLE[2].textSimple + ' ' + MOCK_AYAH_SAMPLE[2].translationEn,
        snippet: MOCK_AYAH_SAMPLE[2].textUthmanic,
        sourceName: 'المصحف الشريف (مجمع الملك فهد)',
        url: '/quran/2/153',
        badgeColor: 'bg-emerald-100 text-emerald-800'
      },
      {
        id: 'hadith-bukhari-1',
        type: 'hadith',
        typeArabic: 'الحديث الشريف',
        title: 'صحيح البخاري - حديث رقم 1',
        subtitle: 'باب بدء الوحي • عن عمر بن الخطاب',
        textToSearch: MOCK_HADITHS[0].textArabic,
        snippet: MOCK_HADITHS[0].textArabic,
        sourceName: 'صحيح البخاري (المكتبة الإسلامية)',
        url: '/hadith/bukhari/1',
        badgeColor: 'bg-amber-100 text-amber-900'
      },
      {
        id: 'fiqh-1',
        type: 'fiqh',
        typeArabic: 'الفقه والأحكام',
        title: 'حكم المسح على الخفين - المذهب الحنفي',
        subtitle: 'كتاب الطهارة • الفقه المقارن',
        textToSearch: MOCK_FIQH_RULINGS[0].topicArabic + ' ' + MOCK_FIQH_RULINGS[0].rulingSummary,
        snippet: MOCK_FIQH_RULINGS[0].rulingSummary,
        sourceName: 'المبسوط للإمام السرخسي',
        url: '/fiqh/1',
        badgeColor: 'bg-purple-100 text-purple-900'
      },
      {
        id: 'seerah-1',
        type: 'seerah',
        typeArabic: 'السيرة النبوية',
        title: 'نزول الوحي في غار حراء',
        subtitle: 'العهد المكي • عام 610 م',
        textToSearch: MOCK_SEERAH_EVENTS[0].titleArabic + ' ' + MOCK_SEERAH_EVENTS[0].description,
        snippet: MOCK_SEERAH_EVENTS[0].description,
        sourceName: 'السيرة النبوية لابن هشام',
        url: '/seerah/1',
        badgeColor: 'bg-blue-100 text-blue-900'
      },
      {
        id: 'scholar-bukhari',
        type: 'scholar',
        typeArabic: 'العلماء والتراجم',
        title: 'الإمام محمد بن إسماعيل البخاري',
        subtitle: 'توفي 256 هـ • أمير المؤمنين في الحديث',
        textToSearch: MOCK_SCHOLARS[0].nameArabic + ' ' + MOCK_SCHOLARS[0].biography,
        snippet: MOCK_SCHOLARS[0].biography,
        sourceName: 'سير أعلام النبلاء للذهبي',
        url: '/scholars/bukhari',
        badgeColor: 'bg-teal-100 text-teal-900'
      },
      {
        id: 'book-1',
        type: 'book',
        typeArabic: 'المكتبة الإسلامية',
        title: 'تفسير القرآن العظيم (تفسير ابن كثير)',
        subtitle: 'المجلد الأول • علم التفسير',
        textToSearch: MOCK_BOOKS[0].titleArabic + ' ' + MOCK_BOOKS[0].description,
        snippet: MOCK_BOOKS[0].description,
        sourceName: 'دار الكتب العلمية',
        url: '/books/1',
        badgeColor: 'bg-[#C5A059]/20 text-amber-900'
      }
    ]);

    setResults(engine.search(query, activeCategory));
  }, [query, activeCategory]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'جميع المصادر' },
    { id: 'quran', label: 'القرآن الكريم' },
    { id: 'hadith', label: 'الحديث الشريف' },
    { id: 'tafsir', label: 'التفسير' },
    { id: 'fiqh', label: 'الفقه والمذاهب' },
    { id: 'seerah', label: 'السيرة' },
    { id: 'scholar', label: 'العلماء' },
    { id: 'book', label: 'المكتبة' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-10 sm:pt-20 px-4">
      <div 
        className="bg-[#FDFBF7] dark:bg-[#121816] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#0F382C]/15 dark:border-[#C5A059]/30 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-3 space-x-reverse bg-white dark:bg-[#162621]">
          <Search className="w-6 h-6 text-[#C5A059]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في القرآن، الحديث، التفسير، والمكتبة..."
            className="w-full bg-transparent text-lg sm:text-xl text-[#0F382C] dark:text-white font-medium focus:outline-none placeholder-gray-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-[#0D1412] border-b border-gray-200 dark:border-gray-800 flex items-center space-x-2 space-x-reverse overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-[#C5A059] ml-2 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#0F382C] text-white dark:bg-[#C5A059] dark:text-gray-950 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#0F382C]/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>تم العثور على {results.length} نتيجة موثوقة ومحققة</span>
            <span className="flex items-center space-x-1 space-x-reverse text-[#0F382C] dark:text-[#C5A059]">
              <ShieldCheck className="w-3.5 h-3.5 ml-1" />
              <span>بحث موثق بالسند والمصدر</span>
            </span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-base font-semibold">لم نجد نتائج مطابقة لـ "{query}"</p>
              <p className="text-xs mt-1 text-gray-400">جرب البحث بكلمات أعم مثل: الصبر، الصلاة، التوبة، البخاري</p>
            </div>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                onClick={() => {
                  if (result.url) router.push(result.url);
                  onClose();
                }}
                className="group p-4 rounded-xl bg-white dark:bg-[#162621] border border-gray-200/80 dark:border-gray-800 hover:border-[#0F382C]/40 dark:hover:border-[#C5A059]/40 transition-all cursor-pointer shadow-sm hover:shadow-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${result.badgeColor || 'bg-emerald-100 text-emerald-800'}`}>
                      {result.typeArabic}
                    </span>
                    {result.subtitle && (
                      <span className="text-xs text-gray-400">{result.subtitle}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#0F382C] dark:text-[#C5A059] font-medium flex items-center group-hover:translate-x-[-2px] transition-transform">
                    <span>المصدر: {result.sourceName}</span>
                    <ShieldCheck className="w-3 h-3 mr-1 text-[#C5A059]" />
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#0F382C] dark:text-white mt-2 group-hover:text-[#C5A059] transition-colors">
                  {result.title}
                </h4>

                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 font-quran leading-relaxed line-clamp-3 bg-gray-50 dark:bg-[#0D1412] p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                  "{result.snippet}"
                </p>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-100 dark:bg-[#0D1412] border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500">
          منصة سَنَد المعرفية • جميع النتائج مأخوذة من المصادر الشرعية المحققة والموثوقة
        </div>
      </div>
    </div>
  );
};
