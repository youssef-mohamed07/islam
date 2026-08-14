'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, Bookmark, Copy, Check, Loader2 } from 'lucide-react';
import { HADITH_COLLECTIONS } from './hadithCollections';

interface HadithBrowserProps {
  initialCollection?: string;
  initialSection?: string;
}

export const HadithBrowser: React.FC<HadithBrowserProps> = ({ initialCollection, initialSection }) => {
  const router = useRouter();
  const validCollection = HADITH_COLLECTIONS.some(c => c.id === initialCollection) ? initialCollection! : 'bukhari';
  const [selectedCollection, setSelectedCollection] = useState(validCollection);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  const [sections, setSections] = useState<Record<string, string>>({});
  const [selectedSection, setSelectedSection] = useState<string>(initialSection || '1');
  
  const [hadiths, setHadiths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const collections = HADITH_COLLECTIONS;

  // Select a collection locally and sync the URL
  const selectCollection = (id: string) => {
    setSelectedCollection(id);
    router.push(`/hadith/${id}`);
  };

  // Select a section locally and sync the URL
  const selectSection = (section: string) => {
    setSelectedSection(section);
    router.push(`/hadith/${selectedCollection}/${section}`);
  };

  // Section coming from the URL applies only to the collection it was loaded for
  const pendingSectionRef = useRef<string | null>(initialSection || null);

  useEffect(() => {
    let isMounted = true;
    setSections({});
    const pendingSection = pendingSectionRef.current;
    pendingSectionRef.current = null;
    if (!pendingSection) setSelectedSection('1');
    
    // Fetch sections for the collection
    fetch(`/api/hadith/sections/${selectedCollection}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data && Object.keys(data).length > 0) {
          setSections(data);
          // Prefer the deep-linked section when it exists, else first valid one
          if (pendingSection && data[pendingSection] !== undefined && data[pendingSection] !== '') {
            setSelectedSection(pendingSection);
          } else {
            const firstSection = Object.keys(data).find(k => data[k] !== '') || '1';
            setSelectedSection(firstSection);
          }
        }
      })
      .catch(err => console.error('Failed to load sections', err));
      
    return () => { isMounted = false; };
  }, [selectedCollection]);

  // Keep selection in sync when the URL changes while the component is mounted
  useEffect(() => {
    if (initialCollection && HADITH_COLLECTIONS.some(c => c.id === initialCollection) && initialCollection !== selectedCollection) {
      pendingSectionRef.current = initialSection || null;
      setSelectedCollection(initialCollection);
    } else if (initialSection && initialSection !== selectedSection) {
      setSelectedSection(initialSection);
    }
  }, [initialCollection, initialSection]);

  useEffect(() => {
    if (!selectedSection) return;
    
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setHadiths([]);

    fetch(`/api/hadith/${selectedCollection}/${selectedSection}`)
      .then(res => {
        if (!res.ok) throw new Error('فشل جلب الأحاديث');
        return res.json();
      })
      .then(data => {
        if (isMounted && data.hadiths) {
          setHadiths(data.hadiths);
        }
      })
      .catch(err => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedCollection, selectedSection]);

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHadiths = hadiths.filter((h: any) => 
    h.text && h.text.includes(searchTerm)
  );

  const activeCollectionDetails = collections.find(c => c.id === selectedCollection);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Title Header */}
      <div className="bg-white dark:bg-[#162621] p-4 sm:p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 mb-4 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F382C] dark:text-[#F5F7F6]">
                الحديث الشريف والسنة النبوية
              </h1>
              <span className="hidden sm:inline-block bg-[#C5A059]/15 text-[#0F382C] dark:text-[#C5A059] text-xs font-semibold px-3 py-1 rounded-full border border-[#C5A059]/30">
                المكتبة الحديثية المحققة
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              تصفح كتب الحديث المعتمدة (البيانات الحقيقية المباشرة)
            </p>
          </div>

          <div className="hidden md:flex items-center space-x-2 space-x-reverse bg-emerald-50 dark:bg-emerald-950/60 text-[#0F382C] dark:text-[#C5A059] px-4 py-2 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 ml-1 text-[#C5A059]" />
            <span>متصل بقاعدة بيانات الأحاديث الحقيقية</span>
          </div>
        </div>
      </div>

      {/* Grid: Collections Grid + Hadith Cards Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
        
        {/* Collections Sidebar / Horizontal List on Mobile */}
        <div className="lg:col-span-1 bg-white dark:bg-[#162621] p-3 sm:p-4 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 self-start">
          <h3 className="font-bold text-sm text-[#0F382C] dark:text-[#C5A059] px-2 mb-3">
            كتب الحديث المعتمدة
          </h3>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-1 lg:pb-0 hide-scrollbar snap-x">
            {collections.map((col) => {
              const isSelected = selectedCollection === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => selectCollection(col.id)}
                  className={`min-w-[120px] lg:min-w-0 lg:w-full text-right p-2.5 sm:p-3 rounded-xl transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between snap-start shrink-0 ${
                    isSelected
                      ? 'bg-[#0F382C] text-white font-bold shadow-md'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 lg:border-transparent'
                  }`}
                >
                  <div className="mb-2 lg:mb-0">
                    <div className="text-sm font-bold">{col.name}</div>
                    <div className="text-[11px] opacity-75">{col.author}</div>
                  </div>
                  <span className="text-[10px] bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded font-mono">
                    {col.total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hadith Stream */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          
          {/* Filters & Search Box - slim sticky row on mobile */}
          <div className="sticky top-14 z-30 bg-white/95 dark:bg-[#162621]/95 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-soft border border-gray-200/80 dark:border-gray-800 flex flex-row gap-2 sm:gap-4">
            
            <div className="flex-1 min-w-0">
              <label className="hidden sm:block text-xs font-bold text-gray-500 mb-1">كتاب / باب</label>
              <select
                value={selectedSection}
                onChange={(e) => selectSection(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-700 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#0F382C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              >
                {Object.keys(sections).map(key => {
                  if (sections[key].trim() === '') return null; // Skip empty sections
                  return (
                    <option key={key} value={key}>
                      {sections[key]}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="hidden sm:block text-xs font-bold text-gray-500 mb-1">بحث في المتن</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث في المتن..."
                  className="w-full bg-gray-50 dark:bg-[#0D1412] border border-gray-200 dark:border-gray-700 rounded-xl py-2 sm:py-2.5 pr-10 pl-3 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>
            </div>

          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#C5A059] mx-auto mb-4" />
              <p className="text-gray-500 font-bold">جاري جلب الأحاديث الصحيحة...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white dark:bg-[#162621] rounded-2xl border border-red-200 dark:border-red-900/30">
              <p className="text-red-500 font-bold mb-2">تعذر جلب الأحاديث</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : filteredHadiths.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#162621] rounded-2xl border border-gray-200/80 dark:border-gray-800">
              <p className="text-gray-500 font-bold">لا يوجد نتائج مطابقة للبحث.</p>
            </div>
          ) : (
            <>
              {/* Cards */}
              {filteredHadiths.slice(0, 50).map((hadith) => {
                const gradeInfo = hadith.grades && hadith.grades.length > 0 ? hadith.grades[0].grade : null;
                const isSahih = gradeInfo ? gradeInfo.includes('صحيح') || gradeInfo.includes('Sahih') : true; // Bukhari/Muslim default to Sahih
                
                return (
                  <div
                    key={hadith.hadithnumber}
                    className="bg-white dark:bg-[#162621] rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 transition-all hover:border-[#0F382C]/40 overflow-hidden"
                  >
                    {/* Topic / Chapter Banner - الوصف */}
                    <div className="bg-[#0F382C]/5 dark:bg-[#C5A059]/5 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                        <span className="text-sm font-extrabold text-[#0F382C] dark:text-[#C5A059]">
                          {sections[selectedSection] || `الباب ${selectedSection}`}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {activeCollectionDetails?.name}
                      </span>
                    </div>

                    <div className="p-4 sm:p-6">
                      {/* Hadith Metadata */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-gray-100 dark:border-gray-800 gap-2 sm:gap-4">
                        <div className="flex items-center space-x-2 space-x-reverse flex-wrap gap-y-2">
                          <span className="bg-[#0F382C] text-white text-xs font-bold px-3 py-1 rounded-full">
                            حديث رقم {hadith.hadithnumber}
                          </span>
                          
                          {(gradeInfo || selectedCollection === 'bukhari' || selectedCollection === 'muslim') && (
                            <span className={`${isSahih ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'} text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center border`}>
                              <ShieldCheck className={`w-3 h-3 ml-1 ${isSahih ? 'text-emerald-600' : 'text-amber-600'}`} />
                              حكم الحديث: {gradeInfo || 'صحيح'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-400 self-end md:self-auto">
                          <button
                            onClick={() => handleCopy(`${hadith.text} [${activeCollectionDetails?.name} - ${hadith.hadithnumber}]`, hadith.hadithnumber)}
                            className="p-1.5 rounded-lg hover:text-black dark:hover:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            title="نسخ"
                          >
                            {copiedId === hadith.hadithnumber ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Matn (Hadith Text) */}
                      <div className="font-quran text-lg sm:text-2xl text-[#0F382C] dark:text-[#F5F7F6] leading-[2.2] sm:leading-[2.5] my-3 sm:my-4 bg-gray-50 dark:bg-[#0D1412] p-4 sm:p-6 rounded-xl border border-gray-100 dark:border-gray-800 text-justify">
                        {hadith.text}
                      </div>

                      {/* Footer Attribution */}
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 px-2">
                        <span className="font-bold">📖 {sections[selectedSection]}</span>
                        <span>الرواية: {activeCollectionDetails?.author}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredHadiths.length > 50 && (
                <div className="text-center text-sm text-gray-400 py-4">
                  تم عرض أول 50 حديثاً فقط.
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
