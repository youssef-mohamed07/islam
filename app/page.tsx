'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { SearchModal } from '@/components/SearchModal';
import { AudioPlayer } from '@/components/AudioPlayer';
import { QuranStudio } from '@/components/QuranStudio';
import { HadithBrowser } from '@/components/HadithBrowser';
import { FiqhComparison } from '@/components/FiqhComparison';
import { SeerahTimeline } from '@/components/SeerahTimeline';
import { MuslimTools } from '@/components/MuslimTools';
import { KhatmahPlanner } from '@/components/KhatmahPlanner';

import { Adhkar } from '@/components/Adhkar';
import { ScholarsList } from '@/components/ScholarsList';

import { QiraatHub } from '@/components/QiraatHub';
import { TafsirExplorer } from '@/components/TafsirExplorer';
import { AuthManager } from '@/components/AuthManager';

import { Search, BookOpen, HeartPulse, Compass, Sparkles, ShieldCheck, Play } from 'lucide-react';
import { UnifiedSearchResult } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [audioTrack, setAudioTrack] = useState<{ surahId: number; surahName: string; ayahNumber: number; reciterName: string; playMode?: 'verse' | 'surah'; totalVerses?: number } | null>(null);

  const handlePlayAudio = (surahId: number, surahName: string, ayahNumber: number, playMode: 'verse' | 'surah' = 'verse', totalVerses?: number) => {
    setAudioTrack({
      surahId,
      surahName,
      ayahNumber,
      reciterName: 'الشيخ محمد صديق المنشاوي',
      playMode,
      totalVerses
    });
  };

  const handleSelectSearchResult = (result: UnifiedSearchResult) => {
    if (result.type === 'quran') setActiveTab('quran');
    else if (result.type === 'hadith') setActiveTab('hadith');
    else if (result.type === 'fiqh') setActiveTab('fiqh');
    else if (result.type === 'seerah') setActiveTab('seerah');
    else setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0D1412] text-[#1A2421] dark:text-[#F5F7F6] font-arabic flex flex-col">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSearchModal={() => setIsSearchOpen(true)}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-8 sm:space-y-16 py-4 sm:py-8">
            
            {/* HERO SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-2 sm:pt-8 pb-4 sm:pb-12">
              <div className="inline-flex max-w-full items-center space-x-2 space-x-reverse px-3 sm:px-4 py-1.5 rounded-full bg-[#C5A059]/15 text-[#0F382C] dark:text-[#C5A059] text-[10px] sm:text-xs font-bold border border-[#C5A059]/30 mb-4 sm:mb-6">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 text-[#C5A059] shrink-0" />
                <span className="truncate min-w-0">المنصة الرقمية المحققة للمعرفة الإسلامية • كل معرفة لها سند</span>
              </div>

              <h1 className="text-2xl sm:text-6xl font-extrabold text-[#0F382C] dark:text-white tracking-tight leading-snug sm:leading-tight max-w-4xl mx-auto">
                كل ما تحتاجه من القرآن والسنة والعلم الإسلامي في مكان واحد
              </h1>

              <p className="text-sm sm:text-lg text-[#2A5C4D] dark:text-gray-300 max-w-2xl mx-auto mt-3 sm:mt-4 font-medium">
                منصة معرفية إسلامية تجمع القرآن والقراءات والتفسير والحديث والكتب والأذكار في تجربة موحدة.
              </p>

              {/* Global Hero Search Bar */}
              <div className="max-w-2xl mx-auto mt-5 sm:mt-8 relative">
                <div 
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-white dark:bg-[#162621] p-3 sm:p-5 rounded-2xl shadow-card border border-[#0F382C]/15 dark:border-[#C5A059]/30 flex items-center space-x-3 sm:space-x-4 space-x-reverse cursor-pointer hover:border-[#0F382C]/40 transition-all group"
                >
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#C5A059] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-base font-medium flex-1 min-w-0 text-right truncate">
                    ابحث في القرآن، الحديث، التفسير، والمكتبة...
                  </span>
                  <span className="hidden sm:inline-block bg-[#0F382C] text-[#C5A059] text-xs font-bold px-4 py-2 rounded-xl">
                    بحث موحد
                  </span>
                </div>
              </div>

              {/* Quick Actions Pills - horizontal scroll row on mobile */}
              <div className="flex items-center gap-2 sm:gap-3 mt-5 sm:mt-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center pb-1">
                {[
                  { label: 'اقرأ القرآن', tab: 'quran', icon: BookOpen },
                  { label: 'استمع للقرآن', tab: 'quran', icon: Play },
                  { label: 'أذكار اليوم', tab: 'adhkar', icon: HeartPulse },
                  { label: 'مواقيت الصلاة', tab: 'tools', icon: Compass },
                  { label: 'مساعد سند AI', tab: 'ai', icon: Sparkles }
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => setActiveTab(action.tab)}
                      className="flex items-center space-x-2 space-x-reverse bg-white dark:bg-[#162621] border border-gray-200 dark:border-gray-800 hover:border-[#0F382C]/30 text-gray-700 dark:text-gray-200 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-card shrink-0"
                    >
                      <Icon className="w-4 h-4 text-[#C5A059]" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* QURAN OF THE DAY & HADITH OF THE DAY */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                
                {/* Quran Verse of the Day Card */}
                <div className="bg-white dark:bg-[#162621] p-5 sm:p-8 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800 mb-3 sm:mb-4">
                      <span className="bg-[#0F382C] text-white text-xs font-bold px-3 py-1 rounded-full">
                        آية اليوم
                      </span>
                      <span className="text-xs text-gray-400 font-mono">سورة البقرة - 153</span>
                    </div>

                    <div className="font-quran text-xl sm:text-2xl text-[#0F382C] dark:text-[#F5F7F6] text-center my-3 sm:my-4 leading-relaxed">
                      "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ"
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-sans mt-2">
                      تفسير السعدي: أمر الله المؤمنين بالاستعانة على أمور دينهم ودنياهم بالصبر والصلاة.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('quran')}
                    className="mt-6 w-full py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-[#0F382C] hover:text-white text-[#0F382C] dark:text-gray-200 text-xs font-bold transition-all text-center"
                  >
                    تصفح سورة البقرة والتفاسير ←
                  </button>
                </div>

                {/* Hadith of the Day Card */}
                <div className="bg-white dark:bg-[#162621] p-5 sm:p-8 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800 mb-3 sm:mb-4">
                      <span className="bg-[#C5A059] text-gray-950 text-xs font-bold px-3 py-1 rounded-full">
                        حديث اليوم المحقق
                      </span>
                      <span className="text-xs text-emerald-600 font-semibold">صحيح البخاري</span>
                    </div>

                    <div className="text-xs text-[#C5A059] font-bold mb-2">
                      عن أمير المؤمنين عمر بن الخطاب رضي الله عنه:
                    </div>

                    <div className="font-quran text-xl text-[#0F382C] dark:text-[#F5F7F6] my-2 leading-relaxed">
                      "إنَّما الأَعْمالُ بالنِّيّاتِ، وإنَّما لِكُلِّ امْرِئٍ ما نَوَى..."
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      السند: أخرجه الإمام البخاري في أصل صحيحه (باب بدء الوحي).
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('hadith')}
                    className="mt-6 w-full py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-[#0F382C] hover:text-white text-[#0F382C] dark:text-gray-200 text-xs font-bold transition-all text-center"
                  >
                    تصفح كُتب الحديث المحققة ←
                  </button>
                </div>

              </div>
            </section>

            {/* FEATURED MODULES GRID */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-5 sm:mb-8">
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#0F382C] dark:text-white">
                  استكشف الموسوعة المعرفية
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  أقسام مصممة بعناية للوصول السريع إلى الأصول الشرعية
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {[
                  { title: 'القرآن والقراءات', desc: '114 سورة بالروايات المتواترة والتفاسير', tab: 'quran', color: 'border-[#0F382C]' },
                  { title: 'الحديث الشريف', desc: 'أمهات الكتب التسعة بالسند والدليل', tab: 'hadith', color: 'border-[#C5A059]' },
                  { title: 'الفقه المقارن', desc: 'مقارنة المذاهب الأربعة مع أدلتها', tab: 'fiqh', color: 'border-purple-600' },
                  { title: 'السيرة النبوية', desc: 'خط زمني تفاعلي لأحداث العصر النبوي', tab: 'seerah', color: 'border-blue-600' },
                  { title: 'أدوات المسلم', desc: 'مواقيت الصلاة، القبلة، والزكاة', tab: 'tools', color: 'border-emerald-600' },
                  { title: 'حاسبة الزكاة', desc: 'حساب النصاب تلقائياً بأسعار الذهب', link: '/zakat', color: 'border-emerald-600' },
                  { title: 'مخطط الختمات', desc: 'خطط لختمتك الفردية أو العائلية', tab: 'khatmah', color: 'border-amber-500' },
                  { title: 'مساعد سند AI', desc: 'محرك إجابات معزز بالمصادر والتخريج', tab: 'ai', color: 'border-[#0F382C]' }
                ].map((m) => (
                  <div
                    key={m.title}
                    onClick={() => m.link ? window.location.href = m.link : setActiveTab(m.tab!)}
                    className={`bg-white dark:bg-[#162621] p-4 sm:p-6 rounded-2xl shadow-soft border-t-4 ${m.color} border-x border-b border-gray-200/80 dark:border-gray-800 hover:shadow-card cursor-pointer transition-all sm:hover:scale-105 active:scale-[0.98]`}
                  >
                    <h3 className="font-extrabold text-sm sm:text-lg text-[#0F382C] dark:text-white mb-1.5 sm:mb-2">
                      {m.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* Tab Modules Routing */}
        {activeTab === 'quran' && <QuranStudio onPlayAudio={handlePlayAudio} />}
        {activeTab === 'qiraat' && <QiraatHub />}
        {activeTab === 'tafsir' && <TafsirExplorer />}
        {activeTab === 'hadith' && <HadithBrowser />}
        {activeTab === 'adhkar' && <Adhkar />}
        {activeTab === 'fiqh' && <FiqhComparison />}
        {activeTab === 'seerah' && <SeerahTimeline />}
        {activeTab === 'khatmah' && <div className="py-6 px-2"><KhatmahPlanner /></div>}

        {activeTab === 'scholars' && <ScholarsList />}
        {activeTab === 'tools' && <MuslimTools />}
        {activeTab === 'account' && <AuthManager onNavigate={setActiveTab} />}

      </main>

      {/* Sticky Audio Player Bar */}
      <AudioPlayer currentTrack={audioTrack} onClose={() => setAudioTrack(null)} />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSearchModal={() => setIsSearchOpen(true)}
      />

    </div>
  );
}
