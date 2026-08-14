'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, HeartPulse, Compass, ShieldCheck, Radio, Moon } from 'lucide-react';
import { useShell } from './AudioContext';

// Rotating "verse/hadith of the day" — changes every 3 hours
const SLOT_MS = 3 * 60 * 60 * 1000;

const VERSES = [
  { ref: 'سورة البقرة - 153', text: '"يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ"', tafsir: 'تفسير السعدي: أمر الله المؤمنين بالاستعانة على أمور دينهم ودنياهم بالصبر والصلاة.', href: '/quran/2/153', label: 'تصفح سورة البقرة والتفاسير ←' },
  { ref: 'سورة الرعد - 28', text: '"أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ"', tafsir: 'تفسير السعدي: طمأنينة القلوب وسكينتها لا تحصل إلا بذكر الله تعالى.', href: '/quran/13/28', label: 'تصفح سورة الرعد والتفاسير ←' },
  { ref: 'سورة الشرح - 5-6', text: '"فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا * إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا"', tafsir: 'تفسير السعدي: بشارة عظيمة بأن اليسر يأتي مع العسر، فلا ييأس المؤمن أبداً.', href: '/quran/94/5', label: 'تصفح سورة الشرح والتفاسير ←' },
  { ref: 'سورة غافر - 60', text: '"وَقَالَ رَبُّكُمُ ٱدْعُونِىٓ أَسْتَجِبْ لَكُمْ"', tafsir: 'تفسير السعدي: أمرٌ بالدعاء ووعدٌ كريم بالإجابة، فلا أعظم من هذا فضلاً.', href: '/quran/40/60', label: 'تصفح سورة غافر والتفاسير ←' },
  { ref: 'سورة الزمر - 53', text: '"لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا"', tafsir: 'تفسير السعدي: باب الرجاء مفتوح دائماً، فرحمة الله وسعت كل شيء.', href: '/quran/39/53', label: 'تصفح سورة الزمر والتفاسير ←' },
  { ref: 'سورة الطلاق - 3', text: '"وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُ"', tafsir: 'تفسير السعدي: من فوّض أمره إلى الله كفاه كل همٍّ، وتولّى سبحانه أمره.', href: '/quran/65/3', label: 'تصفح سورة الطلاق والتفاسير ←' },
  { ref: 'سورة البقرة - 255', text: '"ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ"', tafsir: 'آية الكرسي: أعظم آية في كتاب الله، جمعت التوحيد والحياة والقيومية.', href: '/quran/2/255', label: 'تصفح آية الكرسي والتفاسير ←' },
];

const HADITHS = [
  { narrator: 'عن أمير المؤمنين عمر بن الخطاب رضي الله عنه:', text: '"إنَّما الأَعْمالُ بالنِّيّاتِ، وإنَّما لِكُلِّ امْرِئٍ ما نَوَى..."', source: 'صحيح البخاري', sanad: 'السند: أخرجه الإمام البخاري في أصل صحيحه (باب بدء الوحي).', href: '/hadith/bukhari/1' },
  { narrator: 'عن أبي هريرة رضي الله عنه:', text: '"من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت"', source: 'متفق عليه', sanad: 'السند: أخرجه الإمامان البخاري ومسلم في صحيحيهما.', href: '/hadith/bukhari' },
  { narrator: 'عن أنس بن مالك رضي الله عنه:', text: '"لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه"', source: 'متفق عليه', sanad: 'السند: أخرجه الإمامان البخاري ومسلم في صحيحيهما.', href: '/hadith/muslim' },
  { narrator: 'عن أبي مالك الأشعري رضي الله عنه:', text: '"الطُّهور شطر الإيمان، والحمد لله تملأ الميزان"', source: 'صحيح مسلم', sanad: 'السند: أخرجه الإمام مسلم في صحيحه.', href: '/hadith/muslim' },
  { narrator: 'عن أبي هريرة رضي الله عنه:', text: '"من حُسْنِ إسلامِ المرءِ تَرْكُه ما لا يَعْنِيه"', source: 'صحيح الترمذي', sanad: 'السند: أخرجه الإمام الترمذي وقال: حديث حسن.', href: '/hadith/tirmidhi' },
  { narrator: 'عن أبي ذر رضي الله عنه:', text: '"اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن"', source: 'صحيح الترمذي', sanad: 'السند: أخرجه الإمام الترمذي وقال: حديث حسن صحيح.', href: '/hadith/tirmidhi' },
  { narrator: 'عن أبي هريرة رضي الله عنه:', text: '"كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن"', source: 'متفق عليه', sanad: 'السند: أخرجه الإمامان البخاري ومسلم في صحيحيهما.', href: '/hadith/bukhari' },
  { narrator: 'عن تميم الداري رضي الله عنه:', text: '"الدينُ النصيحةُ"', source: 'صحيح مسلم', sanad: 'السند: أخرجه الإمام مسلم في صحيحه.', href: '/hadith/muslim' },
];

export const HomeClient: React.FC = () => {
  const { openSearch } = useShell();

  // Rotate every 3 hours; set after mount to keep SSR/hydration stable
  const [slot, setSlot] = useState(0);
  useEffect(() => {
    setSlot(Math.floor(Date.now() / SLOT_MS));
  }, []);
  const verse = VERSES[slot % VERSES.length];
  const hadith = HADITHS[slot % HADITHS.length];

  return (
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
            onClick={openSearch}
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
            { label: 'اقرأ القرآن', href: '/quran', icon: BookOpen },
            { label: 'راديو القرآن', href: '/radio', icon: Radio },
            { label: 'التقويم الهجري', href: '/calendar', icon: Moon },
            { label: 'أذكار اليوم', href: '/adhkar', icon: HeartPulse },
            { label: 'مواقيت الصلاة', href: '/tools', icon: Compass }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center space-x-2 space-x-reverse bg-white dark:bg-[#162621] border border-gray-200 dark:border-gray-800 hover:border-[#0F382C]/30 text-gray-700 dark:text-gray-200 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-card shrink-0"
              >
                <Icon className="w-4 h-4 text-[#C5A059]" />
                <span>{action.label}</span>
              </Link>
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
                <span className="text-xs text-gray-400 font-mono">{verse.ref}</span>
              </div>

              <div className="font-quran text-xl sm:text-2xl text-[#0F382C] dark:text-[#F5F7F6] text-center my-3 sm:my-4 leading-relaxed">
                {verse.text}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-sans mt-2">
                {verse.tafsir}
              </p>
            </div>

            <Link
              href={verse.href}
              className="mt-6 w-full py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-[#0F382C] hover:text-white text-[#0F382C] dark:text-gray-200 text-xs font-bold transition-all text-center"
            >
              {verse.label}
            </Link>
          </div>

          {/* Hadith of the Day Card */}
          <div className="bg-white dark:bg-[#162621] p-5 sm:p-8 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-800 mb-3 sm:mb-4">
                <span className="bg-[#C5A059] text-gray-950 text-xs font-bold px-3 py-1 rounded-full">
                  حديث اليوم المحقق
                </span>
                <span className="text-xs text-emerald-600 font-semibold">{hadith.source}</span>
              </div>

              <div className="text-xs text-[#C5A059] font-bold mb-2">
                {hadith.narrator}
              </div>

              <div className="font-quran text-xl text-[#0F382C] dark:text-[#F5F7F6] my-2 leading-relaxed">
                {hadith.text}
              </div>

              <p className="text-xs text-gray-400 mt-2">
                {hadith.sanad}
              </p>
            </div>

            <Link
              href={hadith.href}
              className="mt-6 w-full py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-[#0F382C] hover:text-white text-[#0F382C] dark:text-gray-200 text-xs font-bold transition-all text-center"
            >
              تصفح كُتب الحديث المحققة ←
            </Link>
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
            { title: 'القرآن والقراءات', desc: '114 سورة بالروايات المتواترة والتفاسير', href: '/quran', color: 'border-[#0F382C]' },
            { title: 'الحديث الشريف', desc: 'أمهات الكتب التسعة بالسند والدليل', href: '/hadith', color: 'border-[#C5A059]' },
            { title: 'الراديو الإسلامي', desc: 'بث مباشر لإذاعات القرآن والفتاوى', href: '/radio', color: 'border-blue-500' },
            { title: 'التقويم الهجري', desc: 'تاريخ اليوم والمناسبات الإسلامية', href: '/calendar', color: 'border-indigo-500' },
            { title: 'أسماء الله الحسنى', desc: '99 اسماً بمعانيها وفضلها', href: '/names', color: 'border-rose-500' },
            { title: 'الفقه المقارن', desc: 'مقارنة المذاهب الأربعة مع أدلتها', href: '/fiqh', color: 'border-purple-600' },
            { title: 'السيرة النبوية', desc: 'خط زمني تفاعلي لأحداث العصر النبوي', href: '/seerah', color: 'border-blue-600' },
            { title: 'أدوات المسلم', desc: 'مواقيت الصلاة، القبلة، والزكاة', href: '/tools', color: 'border-emerald-600' },
            { title: 'الزكاة والصدقة', desc: 'زكاة المال والفطر وأنواع الصدقة', href: '/zakat', color: 'border-emerald-600' },
          ].map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className={`bg-white dark:bg-[#162621] p-4 sm:p-6 rounded-2xl shadow-soft border-t-4 ${m.color} border-x border-b border-gray-200/80 dark:border-gray-800 hover:shadow-card cursor-pointer transition-all sm:hover:scale-105 active:scale-[0.98]`}
            >
              <h3 className="font-extrabold text-sm sm:text-lg text-[#0F382C] dark:text-white mb-1.5 sm:mb-2">
                {m.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {m.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};
