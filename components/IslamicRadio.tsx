'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Radio, Volume2, Search } from 'lucide-react';

interface RadioStation {
  id: number;
  name: string;
  url: string;
}

export function IslamicRadio() {
  const [radios, setRadios] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentRadio, setCurrentRadio] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        const res = await fetch('https://mp3quran.net/api/v3/radios?language=ar');
        const data = await res.json();
        if (data.radios) {
          setRadios(data.radios);
        }
      } catch (error) {
        console.error('Failed to fetch radios', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRadios();
  }, []);

  const handlePlay = (radio: RadioStation) => {
    if (currentRadio?.id === radio.id) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play().catch(e => console.error("Audio play error", e));
      }
    } else {
      setCurrentRadio(radio);
      setIsPlaying(true);
    }
  };

  const filteredRadios = radios.filter(r => r.name.includes(searchTerm));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0F382C]/10 dark:bg-[#C5A059]/10 text-[#0F382C] dark:text-[#C5A059] mb-4">
          <Radio className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F382C] dark:text-white mb-2 font-quran">
          الراديو الإسلامي
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          بث مباشر لإذاعات القرآن الكريم بمختلف القراءات والفتاوى والرقية الشرعية
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن إذاعة أو قارئ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#162621] border border-gray-200 dark:border-gray-800 rounded-2xl py-3 px-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50 transition-shadow text-[#0F382C] dark:text-[#F5F7F6]"
          />
          <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRadios.map((radio) => {
            const isActive = currentRadio?.id === radio.id;
            return (
              <div
                key={radio.id}
                onClick={() => handlePlay(radio)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-[#0F382C] border-[#0F382C] text-white shadow-lg scale-[1.02]'
                    : 'bg-white dark:bg-[#162621] border-gray-200 dark:border-gray-800 hover:border-[#C5A059]/50 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-[#0F382C]/10 dark:bg-gray-800 text-[#0F382C] dark:text-[#C5A059]'}`}>
                    {isActive && isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Radio className="w-5 h-5" />}
                  </div>
                  <h3 className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-[#0F382C] dark:text-gray-200'}`}>
                    {radio.name}
                  </h3>
                </div>
                <button
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white text-[#0F382C]'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#C5A059] hover:text-white'
                  }`}
                >
                  {isActive && isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Persistent Audio Player Bar */}
      {currentRadio && (
        <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 bg-[#0F382C] text-white p-4 shadow-2xl z-50 animate-in slide-in-from-bottom border-t border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center shrink-0 shadow-lg">
                <Radio className="w-5 h-5 text-[#0F382C]" />
              </div>
              <div className="truncate">
                <div className="text-xs text-[#C5A059] font-bold mb-0.5">البث المباشر</div>
                <div className="font-bold text-sm truncate">{currentRadio.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <audio
                ref={audioRef}
                src={currentRadio.url}
                autoPlay
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error("Audio loading error", e);
                  setIsPlaying(false);
                }}
              />
              <button
                onClick={() => handlePlay(currentRadio)}
                className="w-12 h-12 rounded-full bg-[#C5A059] text-[#0F382C] flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
