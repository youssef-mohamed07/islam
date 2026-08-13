'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic2, PlayCircle, Info, Search, PauseCircle, Loader2 } from 'lucide-react';

interface Reciter {
  id: number;
  name: string;
  letter: string;
  moshaf: {
    id: number;
    name: string;
    server: string;
    surah_total: number;
  }[];
}

export const QiraatHub: React.FC = () => {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiwayah, setSelectedRiwayah] = useState('الكل');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    fetch('https://www.mp3quran.net/api/v3/reciters?language=ar')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.reciters) {
          // Some reciters have multiple moshafs, we'll just take those that have at least one
          const validReciters = data.reciters.filter((r: Reciter) => r.moshaf && r.moshaf.length > 0);
          setReciters(validReciters);
        }
      })
      .catch(err => console.error("Failed to load reciters", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
      
    return () => { isMounted = false; };
  }, []);

  const handlePlay = (serverUrl: string, reciterId: number) => {
    // Construct the URL for Surah Al-Fatiha (001.mp3)
    let url = serverUrl;
    if (!url.endsWith('/')) url += '/';
    url += '001.mp3';

    if (playingAudio === url) {
      // Pause
      audioRef.current?.pause();
      setPlayingAudio(null);
    } else {
      // Play new
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      } else {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => setPlayingAudio(null);
      }
      setPlayingAudio(url);
    }
  };

  const riwayahs = ['الكل', ...Array.from(new Set(reciters.map(r => r.moshaf[0]?.name).filter(Boolean)))];

  const filteredReciters = reciters.filter(r => {
    const matchesSearch = r.name.includes(searchTerm);
    const matchesRiwayah = selectedRiwayah === 'الكل' || r.moshaf[0]?.name === selectedRiwayah;
    return matchesSearch && matchesRiwayah;
  });

  // The API returns ~200 reciters. To avoid lagging, we'll show the top 50 if search is empty and filter is 'الكل',
  // or all matched if searching or filtering.
  const displayReciters = (searchTerm || selectedRiwayah !== 'الكل') ? filteredReciters : filteredReciters.slice(0, 30);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F382C] to-[#164E3D] p-8 rounded-3xl shadow-card text-center relative overflow-hidden mb-8 border border-[#C5A059]/30">
        <h1 className="text-4xl font-extrabold text-[#C5A059] mb-4">
          القراءات والروايات المتواترة
        </h1>
        <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
          تعرف على القراءات العشر المتواترة واستمع لأشهر القراء بالروايات المختلفة من قاعدة بيانات حقيقية مباشرة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#162621] rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 p-6">
            <div className="flex items-center space-x-2 space-x-reverse mb-4 text-[#0F382C] dark:text-[#C5A059]">
              <Info className="w-5 h-5" />
              <h3 className="font-extrabold text-lg">ما هي القراءات؟</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-justify mb-4">
              القراءات هي مذاهب الأئمة في نطق كلمات القرآن الكريم، وهي ثابتة بالتواتر عن النبي صلى الله عليه وسلم. تنقسم إلى عشر قراءات متواترة، أشهرها قراءة عاصم برواية حفص.
            </p>
            <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300 font-bold">
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                1. نافع المدني (قالون - ورش)
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                2. ابن كثير المكي (البزي - قنبل)
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                3. أبو عمرو البصري (الدوري - السوسي)
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 text-[#C5A059]">
                4. عاصم الكوفي (شعبة - حفص)
              </div>
            </div>
          </div>
        </div>

        {/* Reciters List */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-[#0F382C] dark:text-white flex items-center space-x-2 space-x-reverse">
              <Mic2 className="w-6 h-6 text-[#C5A059]" />
              <span>مكتبة القراء ({reciters.length})</span>
            </h2>
            
            
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن قارئ..."
                  className="w-full bg-white dark:bg-[#162621] border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-10 text-sm font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>
              <select
                value={selectedRiwayah}
                onChange={(e) => setSelectedRiwayah(e.target.value)}
                className="bg-white dark:bg-[#162621] border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-4 text-sm font-bold text-[#0F382C] dark:text-[#C5A059] focus:outline-none focus:ring-2 focus:ring-[#C5A059] flex-1 sm:flex-none sm:w-48"
              >
                {riwayahs.map(riwayah => (
                  <option key={riwayah} value={riwayah}>{riwayah}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#C5A059] mx-auto mb-4" />
              <p className="text-gray-500 font-bold">جاري تحميل القراء الحقيقيين...</p>
            </div>
          ) : displayReciters.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#162621] rounded-2xl border border-gray-200/80 dark:border-gray-800">
              <p className="text-gray-500 font-bold">لا يوجد نتائج مطابقة للبحث.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayReciters.map((reciter) => {
                const moshaf = reciter.moshaf[0]; // Primary moshaf
                
                let targetUrl = moshaf.server;
                if (!targetUrl.endsWith('/')) targetUrl += '/';
                targetUrl += '001.mp3';
                
                const isPlaying = playingAudio === targetUrl;

                return (
                  <div key={reciter.id} className="bg-white dark:bg-[#162621] p-6 rounded-2xl shadow-soft border border-gray-200/80 dark:border-gray-800 flex flex-col transition-all hover:shadow-card hover:border-[#0F382C]/30">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-extrabold text-lg text-[#0F382C] dark:text-white mb-2">
                          {reciter.name}
                        </h3>
                        <div className="text-xs font-bold text-[#C5A059] bg-[#C5A059]/10 inline-block px-2.5 py-1.5 rounded-lg border border-[#C5A059]/20">
                          {moshaf.name}
                        </div>
                      </div>
                      <button 
                        onClick={() => handlePlay(moshaf.server, reciter.id)}
                        className={`${isPlaying ? 'text-[#C5A059] animate-pulse' : 'text-[#0F382C] hover:text-[#C5A059] dark:text-[#F5F7F6] dark:hover:text-[#C5A059]'} transition-colors`}
                        title={isPlaying ? "إيقاف سورة الفاتحة" : "تشغيل سورة الفاتحة"}
                      >
                        {isPlaying ? <PauseCircle className="w-10 h-10" /> : <PlayCircle className="w-10 h-10" />}
                      </button>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] font-bold text-gray-400">
                      <span>إجمالي السور: {moshaf.surah_total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {!isLoading && (!searchTerm && selectedRiwayah === 'الكل') && reciters.length > 30 && (
            <div className="text-center text-sm text-gray-400 py-4 font-bold">
              تم عرض أشهر 30 قارئاً، استخدم مربع البحث للوصول لأي قارئ آخر من بين {reciters.length} قارئ متاح.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
