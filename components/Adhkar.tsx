'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Clock, Check, RefreshCw, BookOpen, Search, ShieldCheck, ChevronDown } from 'lucide-react';
import { BottomSheet } from './BottomSheet';

export const Adhkar: React.FC = () => {
  const [adhkarData, setAdhkarData] = useState<Record<string, { text: string[], footnote: string[] }>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mobile category picker sheet
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  
  // Initialize counters for the current category
  const [counters, setCounters] = useState<Record<number, number>>({});

  useEffect(() => {
    fetch('/data/hisn_almuslim.json')
      .then(res => res.json())
      .then(data => {
        setAdhkarData(data);
        const cats = Object.keys(data);
        setCategories(cats);
        if (cats.length > 0) {
          // Default to morning/evening if exists
          const defaultCat = cats.find(c => c.includes('الصباح')) || cats[0];
          setActiveCategory(defaultCat);
        }
      })
      .catch(err => console.error('Failed to load adhkar', err));
  }, []);

  // Reset counters when category changes
  useEffect(() => {
    if (activeCategory && adhkarData[activeCategory]) {
      const initialCounters: Record<number, number> = {};
      adhkarData[activeCategory].text.forEach((_, index) => {
        initialCounters[index] = 1; // Default count is 1 for Hisn al Muslim unless parsed differently
      });
      setCounters(initialCounters);
    }
  }, [activeCategory, adhkarData]);

  const handleCount = (index: number) => {
    setCounters((prev) => ({
      ...prev,
      [index]: Math.max(0, (prev[index] || 1) - 1)
    }));
  };

  const handleReset = (index: number) => {
    setCounters((prev) => ({
      ...prev,
      [index]: 1
    }));
  };

  const filteredCategories = categories.filter(c => c.includes(searchTerm));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F382C] to-[#164E3D] p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-card text-center relative overflow-hidden mb-4 sm:mb-8 border border-[#C5A059]/30">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#C5A059] mb-2 sm:mb-4">
          حصن المسلم
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl mx-auto mb-3 sm:mb-4">
          أذكار وأدعية من الكتاب والسنة (النسخة الكاملة والمحققة).
        </p>
        
        <div className="hidden sm:flex items-center justify-center space-x-2 space-x-reverse bg-white/10 text-emerald-100 px-4 py-2 rounded-xl text-xs font-semibold max-w-md mx-auto border border-white/20">
          <ShieldCheck className="w-4 h-4 ml-1 text-[#C5A059]" />
          <span>نسخة مطابقة لكتاب "حصن المسلم من أذكار الكتاب والسنة"</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
        
        {/* Categories Sidebar (Desktop Only - mobile uses the bottom sheet picker) */}
        <div className="hidden lg:flex lg:col-span-1 bg-white dark:bg-[#162621] p-4 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 flex-col max-h-[80vh]">
          
          <div className="relative mb-4">
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن باب الدعاء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-10 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          <div className="overflow-y-auto pr-2 space-y-1 custom-scrollbar flex-1">
            {filteredCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-right p-3 rounded-xl transition-all text-sm ${
                  activeCategory === cat
                    ? 'bg-[#0F382C] text-white font-bold shadow-md'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
            {filteredCategories.length === 0 && (
              <div className="text-center text-xs text-gray-400 py-4">لا توجد نتائج</div>
            )}
          </div>
        </div>

        {/* Adhkar List */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          {/* Mobile Category Picker Button (opens bottom sheet) */}
          <button
            onClick={() => setIsCategorySheetOpen(true)}
            className="lg:hidden sticky top-14 z-30 w-full flex items-center justify-between bg-[#0F382C] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md active:scale-[0.98] transition-transform"
          >
            <span className="flex items-center space-x-2 space-x-reverse min-w-0">
              <BookOpen className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span className="truncate">{activeCategory || 'اختر باب الدعاء'}</span>
            </span>
            <ChevronDown className="w-4 h-4 text-[#C5A059] shrink-0" />
          </button>

          <h2 className="hidden lg:flex text-2xl font-extrabold text-[#0F382C] dark:text-[#C5A059] mb-6 items-center space-x-2 space-x-reverse">
            <BookOpen className="w-6 h-6" />
            <span>{activeCategory}</span>
          </h2>

          {activeCategory && adhkarData[activeCategory] && adhkarData[activeCategory].text.map((dhikrText, index) => {
            const currentCount = counters[index] ?? 1;
            const isDone = currentCount === 0;
            const footnote = adhkarData[activeCategory].footnote[index];

            return (
              <div 
                key={index} 
                className={`bg-white dark:bg-[#162621] p-4 sm:p-6 rounded-2xl shadow-soft border transition-all ${
                  isDone 
                    ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20' 
                    : 'border-gray-200/80 dark:border-gray-800 hover:border-[#0F382C]/30'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  
                  <div className="flex-1 space-y-4">
                    {/* Arabic Text */}
                    <div className="font-quran text-xl sm:text-2xl md:text-3xl text-[#0F382C] dark:text-[#F5F7F6] leading-loose text-justify md:text-right">
                      {dhikrText}
                    </div>
                    
                    {/* Footnote / Source */}
                    {footnote && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#0D1412] p-3 rounded-xl border border-gray-100 dark:border-gray-800 mt-4">
                        <span className="font-bold text-[#C5A059]">المصدر والتخريج:</span> {footnote}
                      </div>
                    )}
                  </div>

                  {/* Counter Control */}
                  <div className="flex flex-col items-center justify-center md:w-32 space-y-4 border-t md:border-t-0 md:border-r border-gray-100 dark:border-gray-800 pt-6 md:pt-0 md:pr-6">
                    <button
                      onClick={() => handleCount(index)}
                      disabled={isDone}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-inner transition-all transform active:scale-95 ${
                        isDone 
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                          : 'bg-[#0F382C] text-[#C5A059] hover:bg-[#164E3D] shadow-md cursor-pointer'
                      }`}
                    >
                      {isDone ? <Check className="w-8 h-8" /> : currentCount}
                    </button>
                    
                    <div className="text-xs font-bold text-gray-500">
                      العدد المتبقي
                    </div>

                    {isDone && (
                      <button 
                        onClick={() => handleReset(index)}
                        className="text-[10px] text-gray-400 hover:text-[#0F382C] flex items-center space-x-1 space-x-reverse mt-2"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>إعادة</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}

          {!activeCategory && (
            <div className="text-center py-12 text-gray-500">
              جاري تحميل الأذكار...
            </div>
          )}
        </div>

      </div>

      {/* Mobile Category Picker Bottom Sheet */}
      <BottomSheet
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        title="أبواب الذكر والدعاء"
        searchable
        searchPlaceholder="ابحث عن باب..."
        selectedId={activeCategory}
        items={categories.map((cat) => ({ id: cat, label: cat }))}
        onSelect={(id) => setActiveCategory(id)}
      />
    </div>
  );
};
